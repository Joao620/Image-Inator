"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarBlocaoImagem = void 0;
const gpu_js_1 = require("gpu.js");
const canvas_1 = require("canvas");
const kernels_1 = require("../kernels");
async function gerarPixagem(imagensCodificadas, opcoesPixImage) {
    const atlasCanvas = await criarBlocaoImagem(imagensCodificadas, opcoesPixImage.aspectRatio, opcoesPixImage.reducaoImagemFinal);
    const blocaoData = atlasCanvas.getContext('2d').getImageData(0, 0, atlasCanvas.width, atlasCanvas.height);
    const coresAtlas = pegarCoresBlocao(blocaoData, imagensCodificadas.length, opcoesPixImage.cpuMode);
    const blocaoCodificado = {
        largura: atlasCanvas.width,
        altura: atlasCanvas.height,
        dados: atlasCanvas.toBuffer('image/png')
    };
    return [blocaoCodificado, coresAtlas];
}
exports.default = gerarPixagem;
function pegarCoresBlocao(blocao, quantidadeImagens, cpuMode) {
    const laguraImagem = blocao.width;
    const alturaImagens = blocao.height / quantidadeImagens;
    const gpu = new gpu_js_1.GPU({ mode: cpuMode ? 'cpu' : 'gpu' });
    const configs = {
        output: [quantidadeImagens, 1],
        constants: { largura: blocao.width, altura: blocao.height, divisoesLargura: 1, divisoesAltura: quantidadeImagens }
    };
    const kernelCores = gpu.createKernel(kernels_1.calcularMediaCores, configs);
    const imagemDimensional = new gpu_js_1.Input(blocao.data, [4, laguraImagem, alturaImagens * quantidadeImagens]);
    const resultadoKernelCores = kernelCores(imagemDimensional);
    const resultadoCores = resultadoKernelCores[0].map(arr => ([Math.round(arr[0]), Math.round(arr[1]), Math.round(arr[2])]));
    return resultadoCores;
}
async function criarBlocaoImagem(imagens, aspectRatio, reducaoTamanho) {
    let somaTamanhoLargura = 0;
    let somaTamanhoAltura = 0;
    imagens.forEach(imagem => {
        const { largura, altura } = corteParaProporcao(imagem.largura, imagem.altura, aspectRatio);
        somaTamanhoLargura += largura;
        somaTamanhoAltura += altura;
    });
    const mediaLargura = Math.floor(somaTamanhoLargura / imagens.length);
    const mediaAltura = Math.floor(somaTamanhoAltura / imagens.length);
    const proporcaoReducao = 1 / reducaoTamanho;
    const larguraBlocao = mediaLargura * proporcaoReducao;
    const alturaBlocao = mediaAltura * imagens.length * proporcaoReducao;
    const blocaoImagem = (0, canvas_1.createCanvas)(larguraBlocao, alturaBlocao);
    const ctxBlocaoImagem = blocaoImagem.getContext('2d');
    for (const [index, imagem] of imagens.entries()) {
        const imagemInteira = await (0, canvas_1.loadImage)(imagem.dados);
        const { largura, altura } = corteParaProporcao(imagem.largura, imagem.altura, aspectRatio);
        const larguraCortada = Math.abs(imagem.largura - largura);
        const origemLargura = Math.floor(larguraCortada / 2);
        const alturaCortada = Math.abs(imagem.altura - altura);
        const origemAltura = Math.floor(alturaCortada / 2);
        ctxBlocaoImagem.drawImage(imagemInteira, origemLargura, origemAltura, largura, altura, 0, index * mediaAltura * proporcaoReducao, mediaLargura * proporcaoReducao, mediaAltura * proporcaoReducao);
    }
    return blocaoImagem;
    function corteParaProporcao(imagemLargura, imagemAltura, proporcao) {
        const proporcaoImagem = imagemLargura / imagemAltura;
        let novaLargura = 0, novaAltura = 0;
        if (proporcaoImagem >= proporcao) {
            novaLargura = imagemAltura * proporcao;
            novaAltura = imagemAltura;
        }
        else {
            novaAltura = imagemLargura / proporcao;
            novaLargura = imagemLargura;
        }
        return { largura: novaLargura, altura: novaAltura };
    }
}
exports.criarBlocaoImagem = criarBlocaoImagem;
//# sourceMappingURL=createImageBlock.js.map