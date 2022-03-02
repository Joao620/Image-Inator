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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const comparacaoPiximagem_1 = __importDefault(require("./comparacaoPiximagem"));
const canvas_1 = require("canvas");
function criarImagemMosaico(imagem, coresPixagem, imagemPixagem, proporcaoPiximagem, cpuMode) {
    return __awaiter(this, void 0, void 0, function* () {
        const colecaoPixagem = carregarPiximagem(imagemPixagem, coresPixagem);
        const imagemParaMosaico = carregarImagemParaMosaico(imagem, proporcaoPiximagem, colecaoPixagem);
        const resultadoComparacoes = (0, comparacaoPiximagem_1.default)(colecaoPixagem, imagemParaMosaico, cpuMode);
        gerarImagemMosaico(resultadoComparacoes, colecaoPixagem, imagemParaMosaico, .5);
    });
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
function gerarImagemMosaico(escolhasPixagem, colecaoPixagem, imagemParaMosaico, proporcaoImagemFinal) {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}
