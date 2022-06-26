import comparacaoPiximagem from "./comparacaoPiximagem";
import type {
  cor,
  ColecaoPixagem,
  ImagemParaMosaico,
  OpcoesCriarMosaico,
} from "../types";
import type { GPUVariableType, IKernelRunShortcut, Texture } from "gpu.js";
import { BFKNNS, calcularMediaCores } from "../kernels";
import { createCanvas, Image } from "canvas";
import GPU from "gpu.js";
import {exit} from "process";

export default function imageMosaicFactory(
  imagem: Image,
  coresPixagem: cor[],
  pixagemAtlas: Image,
  cpuMode: boolean,
) {
  const gpu = new GPU.GPU({
    mode: 'gpu'
  });

  const kernelMediaCores = gpu.createKernel(calcularMediaCores, {
    dynamicOutput: true,
    dynamicArguments: true,
    constants: {
      maxLoopX: 8,
      maxLoopY: 8,
    }
  });
  const kernelListaPixagens = gpu.createKernel(BFKNNS, {
    dynamicOutput: true,
    dynamicArguments: true,
    constants:  { quantCoresPixagem: coresPixagem.length },
    argumentTypes: {coresImagemMosaico: 'Array2D(3)', coresPixagem: 'Array1D(3)'},
  });

  //TODO: adicionar um cache aqui ainda
  return function (opcoesCriarMosaico: OpcoesCriarMosaico) {
    return criarImagemMosaico(
      kernelMediaCores,
      kernelListaPixagens,
      imagem,
      coresPixagem,
      pixagemAtlas,
      opcoesCriarMosaico
    );
  };
}

function criarImagemMosaico(
  kernelMediaCores: IKernelRunShortcut,
  kernelListaPixagens: IKernelRunShortcut,
  imagem: Image,
  coresPixagem: cor[],
  pixagemAtlas: Image,
  opcoesCriarMosaico: OpcoesCriarMosaico
) {
  const colecaoPixagem: ColecaoPixagem = carregarPiximagem(
    pixagemAtlas,
    coresPixagem
  );
  const imagemParaMosaico: ImagemParaMosaico = carregarImagemParaMosaico(
    imagem,
    opcoesCriarMosaico.aspectRatio,
    colecaoPixagem
  );

  // @ts-expect-error
  const imagemDimensional = new GPU.Input(imagemParaMosaico.imagem.data, [4, imagemParaMosaico.imagem.width, imagemParaMosaico.imagem.height])

  kernelMediaCores.setOutput([
    imagemParaMosaico.quantDivisoesLargura,
    imagemParaMosaico.quantDivisoesAltura,
  ]);


  kernelListaPixagens.setOutput([
    imagemParaMosaico.quantDivisoesLargura,
    imagemParaMosaico.quantDivisoesAltura,
  ])

  console.log(kernelMediaCores.toString(imagemDimensional, imagemParaMosaico.tamDivisoesLargura, imagemParaMosaico.tamDivisoesAltura))

  exit()

  const mediaCoresResultado = kernelMediaCores(
    imagemDimensional,
    imagemParaMosaico.tamDivisoesLargura,
    imagemParaMosaico.tamDivisoesAltura
  ) as Texture;

  const mediaPixagensResultado = kernelListaPixagens(
    mediaCoresResultado,
    colecaoPixagem.cores
  ) as Float32Array[]


  console.log(
    mediaCoresResultado
  )

  console.log(
    mediaPixagensResultado
  )

  return gerarImagemMosaico(mediaPixagensResultado, colecaoPixagem, imagemParaMosaico, opcoesCriarMosaico.reducaoImagemFinal)

}

function carregarPiximagem(
  imagemPixagem: Image,
  coresPixagem: cor[]
): ColecaoPixagem {
  const quantidadePixagens = coresPixagem.length;

  const larguraPixagemUnica = imagemPixagem.width;
  const alturaPixagemUnica = imagemPixagem.height / quantidadePixagens;

  const colecao: ColecaoPixagem = {
    atlas: imagemPixagem,
    cores: coresPixagem,
    larguraIndividual: larguraPixagemUnica,
    alturaIndividial: alturaPixagemUnica,
    quantidadePixagens: quantidadePixagens,
  };

  return colecao;
}

function carregarImagemParaMosaico(
  imagemParaMosaico: Image,
  proporcaoPixagem: number,
  colecaoPixagem: ColecaoPixagem
): ImagemParaMosaico {
  //Coloca o tamanho das divisoes baseado no tamanho das pixagem redimensionado pela a proporcaoPixagem, limitando pra o baixo o numero para 1
  const tamDivisoesLargura = Math.max(
    Math.round(colecaoPixagem.larguraIndividual * proporcaoPixagem),
    1
  );
  const tamDivisoesAltura = Math.max(
    Math.round(colecaoPixagem.alturaIndividial * proporcaoPixagem),
    1
  );

  const quantDivisoesLargura = Math.floor(
    imagemParaMosaico.width / tamDivisoesLargura
  );
  const quantDivisoesAltura = Math.floor(
    imagemParaMosaico.height / tamDivisoesAltura
  );

  //novo tamanho da imagem considerando que tenha um tamanho exato de divisoes nela
  const novaLargura = tamDivisoesLargura * quantDivisoesLargura;
  const novaAltura = tamDivisoesAltura * quantDivisoesAltura;

  const canvasNovasDimensoes = createCanvas(novaLargura, novaAltura);
  const ctx = canvasNovasDimensoes.getContext("2d", { alpha: false });

  ctx.drawImage(imagemParaMosaico, 0, 0);
  const mosaicoImageData = ctx.getImageData(0, 0, novaLargura, novaAltura);

  return {
    imagem: mosaicoImageData,
    quantDivisoesAltura,
    quantDivisoesLargura,
    tamDivisoesLargura,
    tamDivisoesAltura,
  };
}

async function gerarImagemMosaico(
  escolhasPixagem: Float32Array[],
  colecaoPixagem: ColecaoPixagem,
  imagemParaMosaico: ImagemParaMosaico,
  proporcaoImagemFinal: number
) {
  const { quantDivisoesLargura, quantDivisoesAltura } = imagemParaMosaico;
  const { larguraIndividual, alturaIndividial } = colecaoPixagem;

  const novaLargura = Math.floor(
    quantDivisoesLargura * larguraIndividual * proporcaoImagemFinal
  );
  const novaAltura = Math.floor(
    quantDivisoesAltura * alturaIndividial * proporcaoImagemFinal
  );
  const canvasMosaico = createCanvas(novaLargura, novaAltura);
  const ctxMosaico = canvasMosaico.getContext("2d", { alpha: false });

  //cria varios canvas com as pixagens para ser usado mais facilmente pra colar
  let imagensPixagemIndividual = [];
  for (let i = 0; i < colecaoPixagem.quantidadePixagens; i++) {
    const { alturaIndividial, larguraIndividual } = colecaoPixagem;
    const larguraPixagem = larguraIndividual * proporcaoImagemFinal;
    const alturaPixagem = larguraIndividual * proporcaoImagemFinal;

    const canvasPixagem = createCanvas(larguraPixagem, alturaPixagem);
    const ctxPixagem = canvasPixagem.getContext("2d", { alpha: false });

    ctxPixagem.drawImage(
      colecaoPixagem.atlas,
      0,
      alturaIndividial * i,
      larguraIndividual,
      alturaIndividial,
      0,
      0,
      larguraPixagem,
      alturaPixagem
    );

    imagensPixagemIndividual.push(canvasPixagem);
  }

  //aqui faz a colagem de todos os canvas de pixagens gerados
  for (let x = 0; x < escolhasPixagem.length; x++) {
    const coluna = escolhasPixagem[x];
    for (let y = 0; y < coluna.length; y++) {
      const piximageEscolhida = escolhasPixagem[x][y];
      const imagemPixagem = imagensPixagemIndividual[piximageEscolhida];
      ctxMosaico.drawImage(
        imagemPixagem,
        colecaoPixagem.larguraIndividual * proporcaoImagemFinal * x,
        colecaoPixagem.alturaIndividial * proporcaoImagemFinal * y
      );
    }
  }

  return canvasMosaico;
}
