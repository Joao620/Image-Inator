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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var comparacaoPiximagem_1 = __importDefault(require("./comparacaoPiximagem"));
var canvas_1 = require("canvas");
var fs_1 = require("fs");
function criarImagemMosaico(imagem, coresPixagem, imagemPixagem, proporcaoPiximagem, cpuMode) {
    return __awaiter(this, void 0, void 0, function () {
        var colecaoPixagem, imagemParaMosaico, resultadoComparacoes;
        return __generator(this, function (_a) {
            colecaoPixagem = carregarPiximagem(imagemPixagem, coresPixagem);
            imagemParaMosaico = carregarImagemParaMosaico(imagem, proporcaoPiximagem, colecaoPixagem);
            resultadoComparacoes = (0, comparacaoPiximagem_1.default)(colecaoPixagem, imagemParaMosaico, cpuMode);
            gerarImagemMosaico(resultadoComparacoes, colecaoPixagem, imagemParaMosaico, .5);
            return [2 /*return*/];
        });
    });
}
exports.default = criarImagemMosaico;
function carregarPiximagem(imagemPixagem, coresPixagem) {
    var quantidadePixagens = coresPixagem.length;
    var larguraPixagemUnica = imagemPixagem.width;
    var alturaPixagemUnica = imagemPixagem.height / quantidadePixagens;
    var colecao = {
        imagem: imagemPixagem,
        cores: coresPixagem,
        larguraIndividual: larguraPixagemUnica,
        alturaIndividial: alturaPixagemUnica,
        quantidadePixagens: quantidadePixagens
    };
    return colecao;
}
function carregarImagemParaMosaico(imagemParaMosaico, proporcaoPixagem, colecaoPixagem) {
    //Coloca o tamanho das divisoes baseado no tamanho das pixagem redimensionado pela a proporcaoPixagem, limitando pra o baixo o numero para 1
    var tamDivisoesLargura = Math.max(Math.round(colecaoPixagem.larguraIndividual * proporcaoPixagem), 1);
    var tamDivisoesAltura = Math.max(Math.round(colecaoPixagem.alturaIndividial * proporcaoPixagem), 1);
    var quantDivisoesLargura = Math.floor(imagemParaMosaico.width / tamDivisoesLargura);
    var quantDivisoesAltura = Math.floor(imagemParaMosaico.height / tamDivisoesAltura);
    //novo tamanho da imagem considerando que tenha um tamanho exato de divisoes nela
    var novaLargura = tamDivisoesLargura * quantDivisoesLargura;
    var novaAltura = tamDivisoesAltura * quantDivisoesAltura;
    var canvasNovasDimensoes = (0, canvas_1.createCanvas)(novaLargura, novaAltura);
    var ctx = canvasNovasDimensoes.getContext('2d', { alpha: false });
    ctx.drawImage(imagemParaMosaico, 0, 0);
    var mosaicoImageData = ctx.getImageData(0, 0, novaLargura, novaAltura);
    return {
        imagem: mosaicoImageData,
        quantDivisoesAltura: quantDivisoesAltura,
        quantDivisoesLargura: quantDivisoesLargura,
        tamDivisoesLargura: tamDivisoesLargura,
        tamDivisoesAltura: tamDivisoesAltura
    };
}
function gerarImagemMosaico(escolhasPixagem, colecaoPixagem, imagemParaMosaico, proporcaoImagemFinal) {
    return __awaiter(this, void 0, void 0, function () {
        var quantDivisoesLargura, quantDivisoesAltura, larguraIndividual, alturaIndividial, novaLargura, novaAltura, canvasMosaico, ctxMosaico, imagensPixagemIndividual, i, alturaIndividial_1, larguraIndividual_1, larguraPixagem, alturaPixagem, canvasPixagem, ctxPixagem, x, coluna, y, piximageEscolhida, imagemPixagem, buff;
        return __generator(this, function (_a) {
            quantDivisoesLargura = imagemParaMosaico.quantDivisoesLargura, quantDivisoesAltura = imagemParaMosaico.quantDivisoesAltura;
            larguraIndividual = colecaoPixagem.larguraIndividual, alturaIndividial = colecaoPixagem.alturaIndividial;
            novaLargura = Math.floor(quantDivisoesLargura * larguraIndividual * proporcaoImagemFinal);
            novaAltura = Math.floor(quantDivisoesAltura * alturaIndividial * proporcaoImagemFinal);
            canvasMosaico = (0, canvas_1.createCanvas)(novaLargura, novaAltura);
            ctxMosaico = canvasMosaico.getContext('2d', { alpha: false });
            imagensPixagemIndividual = [];
            for (i = 0; i < colecaoPixagem.quantidadePixagens; i++) {
                alturaIndividial_1 = colecaoPixagem.alturaIndividial, larguraIndividual_1 = colecaoPixagem.larguraIndividual;
                larguraPixagem = larguraIndividual_1 * proporcaoImagemFinal;
                alturaPixagem = larguraIndividual_1 * proporcaoImagemFinal;
                canvasPixagem = (0, canvas_1.createCanvas)(larguraPixagem, alturaPixagem);
                ctxPixagem = canvasPixagem.getContext('2d', { alpha: false });
                ctxPixagem.drawImage(colecaoPixagem.imagem, 0, alturaIndividial_1 * i, larguraIndividual_1, alturaIndividial_1, 0, 0, larguraPixagem, alturaPixagem);
                imagensPixagemIndividual.push(canvasPixagem);
            }
            //aqui faz a colagem de todos os canvas de pixagens gerados
            for (x = 0; x < escolhasPixagem.length; x++) {
                coluna = escolhasPixagem[x];
                for (y = 0; y < coluna.length; y++) {
                    piximageEscolhida = escolhasPixagem[x][y];
                    imagemPixagem = imagensPixagemIndividual[piximageEscolhida];
                    ctxMosaico.drawImage(imagemPixagem, colecaoPixagem.larguraIndividual * proporcaoImagemFinal * x, colecaoPixagem.alturaIndividial * proporcaoImagemFinal * y);
                }
            }
            buff = canvasMosaico.toBuffer('image/png');
            (0, fs_1.writeFileSync)('dale.png', buff);
            return [2 /*return*/];
        });
    });
}
//# sourceMappingURL=criarMosaicoImagem.js.map