"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarBlocaoImagem = void 0;
const gpu_js_1 = require("gpu.js");
const canvas_1 = require("canvas");
const kernels_1 = require("../kernels");
function gerarPixagem(imagensCodificadas, proporcaoEscolida, reducaoTamanho) {
    return __awaiter(this, void 0, void 0, function* () {
        const blocaoCanvas = yield criarBlocaoImagem(imagensCodificadas, proporcaoEscolida, reducaoTamanho);
        const blocaoData = blocaoCanvas.getContext('2d').getImageData(0, 0, blocaoCanvas.width, blocaoCanvas.height);
        const coresBlocao = pegarCoresBlocao(blocaoData, imagensCodificadas.length);
        const blocaoCodificado = {
            largura: blocaoCanvas.width,
            altura: blocaoCanvas.height,
            dados: blocaoCanvas.toBuffer('image/png')
        };
        return [blocaoCodificado, coresBlocao];
    });
}
exports.default = gerarPixagem;
function pegarCoresBlocao(blocao, quantidadeImagens) {
    const laguraImagem = blocao.width;
    const alturaImagens = blocao.height / quantidadeImagens;
    const gpu = new gpu_js_1.GPU();
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
function criarBlocaoImagem(imagens, proporcaoEscolida, reducaoTamanho) {
    return __awaiter(this, void 0, void 0, function* () {
        let somaTamanhoLargura = 0;
        let somaTamanhoAltura = 0;
        imagens.forEach(imagem => {
            const { largura, altura } = corteParaProporcao(imagem.largura, imagem.altura, proporcaoEscolida);
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
            const imagemInteira = yield (0, canvas_1.loadImage)(imagem.dados);
            const { largura, altura } = corteParaProporcao(imagem.largura, imagem.altura, proporcaoEscolida);
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
    });
}
exports.criarBlocaoImagem = criarBlocaoImagem;
