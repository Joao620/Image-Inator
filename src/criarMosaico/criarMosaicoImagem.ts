import comparacaoPiximagem from "./comparacaoPiximagem";
import { cor, ColecaoPixagem, ImagemParaMosaico } from '../types'
import { createCanvas, Image } from "canvas";

export default async function criarImagemMosaico(imagem: Image, coresPixagem: cor[], imagemPixagem: Image, proporcaoPiximagem: number, cpuMode: boolean){
  const colecaoPixagem: ColecaoPixagem = carregarPiximagem(imagemPixagem, coresPixagem)
  const imagemParaMosaico: ImagemParaMosaico = carregarImagemParaMosaico(imagem, proporcaoPiximagem, colecaoPixagem)

  const resultadoComparacoes = comparacaoPiximagem(colecaoPixagem, imagemParaMosaico, cpuMode)

  gerarImagemMosaico(resultadoComparacoes, colecaoPixagem, imagemParaMosaico, .5)
}

function carregarPiximagem(imagemPixagem: Image, coresPixagem: cor[]): ColecaoPixagem {
  const quantidadePixagens = coresPixagem.length

  const larguraPixagemUnica = imagemPixagem.width
  const alturaPixagemUnica = imagemPixagem.height / quantidadePixagens

  const colecao: ColecaoPixagem = {
    imagem: imagemPixagem,
    cores: coresPixagem,
    larguraIndividual: larguraPixagemUnica,
    alturaIndividial: alturaPixagemUnica,
    quantidadePixagens: quantidadePixagens
  }

  return colecao

}

function carregarImagemParaMosaico(imagemParaMosaico: Image, proporcaoPixagem: number, colecaoPixagem: ColecaoPixagem): ImagemParaMosaico {
  //Coloca o tamanho das divisoes baseado no tamanho das pixagem redimensionado pela a proporcaoPixagem, limitando pra o baixo o numero para 1
  const tamDivisoesLargura = Math.max(Math.round(colecaoPixagem.larguraIndividual * proporcaoPixagem), 1)
  const tamDivisoesAltura = Math.max(Math.round(colecaoPixagem.alturaIndividial * proporcaoPixagem), 1)

  const quantDivisoesLargura = Math.floor(imagemParaMosaico.width / tamDivisoesLargura)
  const quantDivisoesAltura = Math.floor(imagemParaMosaico.height / tamDivisoesAltura)

  //novo tamanho da imagem considerando que tenha um tamanho exato de divisoes nela
  const novaLargura = tamDivisoesLargura * quantDivisoesLargura
  const novaAltura = tamDivisoesAltura * quantDivisoesAltura

  const canvasNovasDimensoes = createCanvas(novaLargura, novaAltura)
  const ctx = canvasNovasDimensoes.getContext('2d', {alpha: false})

  ctx.drawImage(imagemParaMosaico, 0, 0)
  const mosaicoImageData = ctx.getImageData(0, 0, novaLargura, novaAltura)

  return {
    imagem: mosaicoImageData,
    quantDivisoesAltura,
    quantDivisoesLargura,
    tamDivisoesLargura,
    tamDivisoesAltura
  }
  
  
}

async function gerarImagemMosaico(escolhasPixagem: Float32Array[], colecaoPixagem: ColecaoPixagem, imagemParaMosaico: ImagemParaMosaico, proporcaoImagemFinal: number){
  const { quantDivisoesLargura, quantDivisoesAltura } = imagemParaMosaico
  const { larguraIndividual, alturaIndividial } = colecaoPixagem

  const novaLargura = Math.floor(quantDivisoesLargura * larguraIndividual * proporcaoImagemFinal)
  const novaAltura = Math.floor(quantDivisoesAltura * alturaIndividial * proporcaoImagemFinal)
  const canvasMosaico = createCanvas(novaLargura, novaAltura)
  const ctxMosaico = canvasMosaico.getContext('2d', { alpha: false })

  //cria varios canvas com as pixagens para ser usado mais facilmente pra colar
  let imagensPixagemIndividual = []
  for(let i = 0; i < colecaoPixagem.quantidadePixagens; i++){
    const { alturaIndividial, larguraIndividual } = colecaoPixagem
    const larguraPixagem = larguraIndividual * proporcaoImagemFinal
    const alturaPixagem = larguraIndividual * proporcaoImagemFinal

    const canvasPixagem = createCanvas(larguraPixagem, alturaPixagem)
    const ctxPixagem = canvasPixagem.getContext('2d', { alpha: false })

    ctxPixagem.drawImage(
    colecaoPixagem.imagem,
    0,
    alturaIndividial * i,
    larguraIndividual,
    alturaIndividial,
    0,
    0,
    larguraPixagem,
    alturaPixagem,
    )

    imagensPixagemIndividual.push(canvasPixagem)
  }

  //aqui faz a colagem de todos os canvas de pixagens gerados
  for(let x = 0; x < escolhasPixagem.length; x++){
    const coluna = escolhasPixagem[x]
    for(let y = 0; y < coluna.length; y++){
      const piximageEscolhida = escolhasPixagem[x][y]
      const imagemPixagem = imagensPixagemIndividual[piximageEscolhida]
      ctxMosaico.drawImage(
        imagemPixagem,
        colecaoPixagem.larguraIndividual * proporcaoImagemFinal * x,
        colecaoPixagem.alturaIndividial * proporcaoImagemFinal * y,
      )
    }
  }

  return canvasMosaico

  //TODO: aqui que o arquivo eh salvo
  //const buff = canvasMosaico.toBuffer('image/png')
  //writeFileSync('dale.png', buff)
}
