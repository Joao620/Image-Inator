"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const comparacaoPiximagem_1 = __importDefault(require("./comparacaoPiximagem"));
const canvas_1 = require("canvas");
async function criarImagemMosaico(imagem, coresPixagem, pixagemAtlas, opcoesCriarMosaico) {
    const colecaoPixagem = carregarPiximagem(pixagemAtlas, coresPixagem);
    const imagemParaMosaico = carregarImagemParaMosaico(imagem, opcoesCriarMosaico.aspectRatio, colecaoPixagem);
    const resultadoComparacoes = (0, comparacaoPiximagem_1.default)(colecaoPixagem, imagemParaMosaico, opcoesCriarMosaico.cpuMode);
    return gerarImagemMosaico(resultadoComparacoes, colecaoPixagem, imagemParaMosaico, opcoesCriarMosaico.reducaoImagemFinal);
}
exports.default = criarImagemMosaico;
function carregarPiximagem(imagemPixagem, coresPixagem) {
    const quantidadePixagens = coresPixagem.length;
    const larguraPixagemUnica = imagemPixagem.width;
    const alturaPixagemUnica = imagemPixagem.height / quantidadePixagens;
    const colecao = {
        imagem: imagemPixagem,
        cores: coresPixagem,
        larguraIndividual: larguraPixagemUnica,
        alturaIndividial: alturaPixagemUnica,
        quantidadePixagens: quantidadePixagens
    };
    return colecao;
}
function carregarImagemParaMosaico(imagemParaMosaico, proporcaoPixagem, colecaoPixagem) {
    const tamDivisoesLargura = Math.max(Math.round(colecaoPixagem.larguraIndividual * proporcaoPixagem), 1);
    const tamDivisoesAltura = Math.max(Math.round(colecaoPixagem.alturaIndividial * proporcaoPixagem), 1);
    const quantDivisoesLargura = Math.floor(imagemParaMosaico.width / tamDivisoesLargura);
    const quantDivisoesAltura = Math.floor(imagemParaMosaico.height / tamDivisoesAltura);
    const novaLargura = tamDivisoesLargura * quantDivisoesLargura;
    const novaAltura = tamDivisoesAltura * quantDivisoesAltura;
    const canvasNovasDimensoes = (0, canvas_1.createCanvas)(novaLargura, novaAltura);
    const ctx = canvasNovasDimensoes.getContext('2d', { alpha: false });
    ctx.drawImage(imagemParaMosaico, 0, 0);
    const mosaicoImageData = ctx.getImageData(0, 0, novaLargura, novaAltura);
    return {
        imagem: mosaicoImageData,
        quantDivisoesAltura,
        quantDivisoesLargura,
        tamDivisoesLargura,
        tamDivisoesAltura
    };
}
async function gerarImagemMosaico(escolhasPixagem, colecaoPixagem, imagemParaMosaico, proporcaoImagemFinal) {
    const { quantDivisoesLargura, quantDivisoesAltura } = imagemParaMosaico;
    const { larguraIndividual, alturaIndividial } = colecaoPixagem;
    const novaLargura = Math.floor(quantDivisoesLargura * larguraIndividual * proporcaoImagemFinal);
    const novaAltura = Math.floor(quantDivisoesAltura * alturaIndividial * proporcaoImagemFinal);
    const canvasMosaico = (0, canvas_1.createCanvas)(novaLargura, novaAltura);
    const ctxMosaico = canvasMosaico.getContext('2d', { alpha: false });
    let imagensPixagemIndividual = [];
    for (let i = 0; i < colecaoPixagem.quantidadePixagens; i++) {
        const { alturaIndividial, larguraIndividual } = colecaoPixagem;
        const larguraPixagem = larguraIndividual * proporcaoImagemFinal;
        const alturaPixagem = larguraIndividual * proporcaoImagemFinal;
        const canvasPixagem = (0, canvas_1.createCanvas)(larguraPixagem, alturaPixagem);
        const ctxPixagem = canvasPixagem.getContext('2d', { alpha: false });
        ctxPixagem.drawImage(colecaoPixagem.imagem, 0, alturaIndividial * i, larguraIndividual, alturaIndividial, 0, 0, larguraPixagem, alturaPixagem);
        imagensPixagemIndividual.push(canvasPixagem);
    }
    for (let x = 0; x < escolhasPixagem.length; x++) {
        const coluna = escolhasPixagem[x];
        for (let y = 0; y < coluna.length; y++) {
            const piximageEscolhida = escolhasPixagem[x][y];
            const imagemPixagem = imagensPixagemIndividual[piximageEscolhida];
            ctxMosaico.drawImage(imagemPixagem, colecaoPixagem.larguraIndividual * proporcaoImagemFinal * x, colecaoPixagem.alturaIndividial * proporcaoImagemFinal * y);
        }
    }
    return canvasMosaico;
}
//# sourceMappingURL=criarMosaicoImagem.js.map