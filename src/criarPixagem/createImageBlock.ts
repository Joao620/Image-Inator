import { GPU, Input } from "gpu.js";
import { createCanvas, loadImage } from 'canvas'

import { cor, Imagem, OpcoesPixImage } from "../types";
import { calcularMediaCores } from '../kernels'

export default async function gerarPixagem(imagensCodificadas: Imagem[], opcoesPixImage: OpcoesPixImage): Promise<[Imagem, cor[]]>{
    //TODO: Isso parece que vai gastar memoria pra porra
    const atlasCanvas = await criarBlocaoImagem(imagensCodificadas, opcoesPixImage.aspectRatio, opcoesPixImage.reducaoImagemFinal)

    const blocaoData = atlasCanvas.getContext('2d').getImageData(0, 0, atlasCanvas.width, atlasCanvas.height)

    const coresAtlas = pegarCoresBlocao(blocaoData, imagensCodificadas.length, opcoesPixImage.cpuMode)

    const blocaoCodificado: Imagem = {
        largura: atlasCanvas.width,
        altura: atlasCanvas.height,
        //TODO: isso eh pessimo, nunca que vai rodar na web
        //talvez passar isso para ImageData pra ficar compativel com a web
        dados: atlasCanvas.toBuffer('image/png')
    }
    
    return [blocaoCodificado, coresAtlas]
}

function pegarCoresBlocao(blocao: ImageData, quantidadeImagens: number, cpuMode: boolean){
    const laguraImagem = blocao.width
    const alturaImagens = blocao.height / quantidadeImagens

    const gpu = new GPU({mode: cpuMode ? 'cpu' : 'gpu'})

    const configs = {
        output: [quantidadeImagens, 1],
        constants: {largura: blocao.width, altura: blocao.height, divisoesLargura: 1, divisoesAltura: quantidadeImagens}
    }

    const kernelCores = gpu.createKernel(calcularMediaCores, configs)

    // a porra da biblioteca nao aceita uInt8clampedarray, mas funciona normal
    //@ts-expect-error
    const imagemDimensional = new Input(blocao.data, [4, laguraImagem, alturaImagens * quantidadeImagens])

    const resultadoKernelCores = kernelCores(imagemDimensional) as cor[][]

    const resultadoCores: cor[] = resultadoKernelCores[0].map(arr => (
        [Math.round(arr[0]), Math.round(arr[1]), Math.round(arr[2])]
    ))

    return resultadoCores
}

export async function criarBlocaoImagem(imagens: Imagem[], aspectRatio: number, reducaoTamanho: number){
    let somaTamanhoLargura = 0
    let somaTamanhoAltura = 0

    imagens.forEach(imagem => {
        const {largura, altura} = corteParaProporcao(imagem.largura, imagem.altura, aspectRatio)
        somaTamanhoLargura += largura
        somaTamanhoAltura += altura
    })

    const mediaLargura = Math.floor(somaTamanhoLargura / imagens.length)
    const mediaAltura = Math.floor(somaTamanhoAltura / imagens.length)

    const proporcaoReducao = 1 / reducaoTamanho

    const larguraBlocao = mediaLargura * proporcaoReducao
    const alturaBlocao = mediaAltura * imagens.length * proporcaoReducao


    const blocaoImagem = createCanvas(larguraBlocao, alturaBlocao)
    const ctxBlocaoImagem = blocaoImagem.getContext('2d')

    for(const [index, imagem] of imagens.entries()){
        //@ts-expect-error
        const imagemInteira = await loadImage(imagem.dados)

        const {largura, altura} = corteParaProporcao(imagem.largura, imagem.altura, aspectRatio)

        const larguraCortada = Math.abs(imagem.largura - largura)
        const origemLargura = Math.floor(larguraCortada / 2)

        const alturaCortada = Math.abs(imagem.altura - altura)
        const origemAltura = Math.floor(alturaCortada / 2)

        //esse demonio vai colar a imagem no blocaoImagem com a posicao e tamanho certo, nunca mexa nisso
        ctxBlocaoImagem.drawImage(
            imagemInteira,
            origemLargura,
            origemAltura,
            largura,
            altura,
            0,
            index * mediaAltura * proporcaoReducao,
            mediaLargura * proporcaoReducao,
            mediaAltura * proporcaoReducao
        )

    }

    //return ctxBlocaoImagem.getImageData(0, 0, blocaoImagem.width, blocaoImagem.height)
    return blocaoImagem

    function corteParaProporcao (imagemLargura: number, imagemAltura: number, proporcao: number){
        const proporcaoImagem = imagemLargura / imagemAltura
        let novaLargura = 0,
            novaAltura = 0

        if(proporcaoImagem >= proporcao){
            //pela a porporcao eu vejo que imagem vai creser mais a largura do que a altura
            //entao eu continuo com a altura e diminuo a largura
            novaLargura = imagemAltura * proporcao
            novaAltura = imagemAltura
        } else {
            novaAltura = imagemLargura / proporcao
            novaLargura = imagemLargura
        }

        return {largura: novaLargura, altura: novaAltura}
    }
}
