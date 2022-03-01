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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarBlocaoImagem = void 0;
var gpu_js_1 = require("gpu.js");
var canvas_1 = require("canvas");
var kernels_1 = require("../kernels");
function gerarPixagem(imagensCodificadas, proporcaoEscolida, reducaoTamanho) {
    return __awaiter(this, void 0, void 0, function () {
        var blocaoCanvas, blocaoData, coresBlocao, blocaoCodificado;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, criarBlocaoImagem(imagensCodificadas, proporcaoEscolida, reducaoTamanho)
                    //
                ];
                case 1:
                    blocaoCanvas = _a.sent();
                    blocaoData = blocaoCanvas.getContext('2d').getImageData(0, 0, blocaoCanvas.width, blocaoCanvas.height);
                    coresBlocao = pegarCoresBlocao(blocaoData, imagensCodificadas.length);
                    blocaoCodificado = {
                        largura: blocaoCanvas.width,
                        altura: blocaoCanvas.height,
                        //talvez passar isso para ImageData pra ficar compativel com a web
                        dados: blocaoCanvas.toBuffer('image/png')
                    };
                    return [2 /*return*/, [blocaoCodificado, coresBlocao]];
            }
        });
    });
}
exports.default = gerarPixagem;
function pegarCoresBlocao(blocao, quantidadeImagens) {
    var laguraImagem = blocao.width;
    var alturaImagens = blocao.height / quantidadeImagens;
    var gpu = new gpu_js_1.GPU();
    var configs = {
        output: [quantidadeImagens, 1],
        constants: { largura: blocao.width, altura: blocao.height, divisoesLargura: 1, divisoesAltura: quantidadeImagens }
    };
    var kernelCores = gpu.createKernel(kernels_1.calcularMediaCores, configs);
    // a porra da biblioteca nao aceita uInt8clampedarray, mas funciona normal
    //@ts-expect-error
    var imagemDimensional = new gpu_js_1.Input(blocao.data, [4, laguraImagem, alturaImagens * quantidadeImagens]);
    var resultadoKernelCores = kernelCores(imagemDimensional);
    var resultadoCores = resultadoKernelCores[0].map(function (arr) { return ([Math.round(arr[0]), Math.round(arr[1]), Math.round(arr[2])]); });
    return resultadoCores;
}
function criarBlocaoImagem(imagens, proporcaoEscolida, reducaoTamanho) {
    return __awaiter(this, void 0, void 0, function () {
        function corteParaProporcao(imagemLargura, imagemAltura, proporcao) {
            var proporcaoImagem = imagemLargura / imagemAltura;
            var novaLargura = 0, novaAltura = 0;
            if (proporcaoImagem >= proporcao) {
                //pela a porporcao eu vejo que imagem vai creser mais a largura do que a altura
                //entao eu continuo com a altura e diminuo a largura
                novaLargura = imagemAltura * proporcao;
                novaAltura = imagemAltura;
            }
            else {
                novaAltura = imagemLargura / proporcao;
                novaLargura = imagemLargura;
            }
            return { largura: novaLargura, altura: novaAltura };
        }
        var somaTamanhoLargura, somaTamanhoAltura, mediaLargura, mediaAltura, proporcaoReducao, larguraBlocao, alturaBlocao, blocaoImagem, ctxBlocaoImagem, _a, _b, _c, index, imagem, imagemInteira, _d, largura, altura, larguraCortada, origemLargura, alturaCortada, origemAltura, e_1_1;
        var e_1, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    somaTamanhoLargura = 0;
                    somaTamanhoAltura = 0;
                    imagens.forEach(function (imagem) {
                        var _a = corteParaProporcao(imagem.largura, imagem.altura, proporcaoEscolida), largura = _a.largura, altura = _a.altura;
                        somaTamanhoLargura += largura;
                        somaTamanhoAltura += altura;
                    });
                    mediaLargura = Math.floor(somaTamanhoLargura / imagens.length);
                    mediaAltura = Math.floor(somaTamanhoAltura / imagens.length);
                    proporcaoReducao = 1 / reducaoTamanho;
                    larguraBlocao = mediaLargura * proporcaoReducao;
                    alturaBlocao = mediaAltura * imagens.length * proporcaoReducao;
                    blocaoImagem = (0, canvas_1.createCanvas)(larguraBlocao, alturaBlocao);
                    ctxBlocaoImagem = blocaoImagem.getContext('2d');
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 6, 7, 8]);
                    _a = __values(imagens.entries()), _b = _a.next();
                    _f.label = 2;
                case 2:
                    if (!!_b.done) return [3 /*break*/, 5];
                    _c = __read(_b.value, 2), index = _c[0], imagem = _c[1];
                    return [4 /*yield*/, (0, canvas_1.loadImage)(imagem.dados)];
                case 3:
                    imagemInteira = _f.sent();
                    _d = corteParaProporcao(imagem.largura, imagem.altura, proporcaoEscolida), largura = _d.largura, altura = _d.altura;
                    larguraCortada = Math.abs(imagem.largura - largura);
                    origemLargura = Math.floor(larguraCortada / 2);
                    alturaCortada = Math.abs(imagem.altura - altura);
                    origemAltura = Math.floor(alturaCortada / 2);
                    //esse demonio vai colar a imagem no blocaoImagem com a posicao e tamanho certo, nunca mexa nisso
                    ctxBlocaoImagem.drawImage(imagemInteira, origemLargura, origemAltura, largura, altura, 0, index * mediaAltura * proporcaoReducao, mediaLargura * proporcaoReducao, mediaAltura * proporcaoReducao);
                    _f.label = 4;
                case 4:
                    _b = _a.next();
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 8];
                case 6:
                    e_1_1 = _f.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 8];
                case 7:
                    try {
                        if (_b && !_b.done && (_e = _a.return)) _e.call(_a);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 8: 
                //return ctxBlocaoImagem.getImageData(0, 0, blocaoImagem.width, blocaoImagem.height)
                return [2 /*return*/, blocaoImagem];
            }
        });
    });
}
exports.criarBlocaoImagem = criarBlocaoImagem;
//# sourceMappingURL=createImageBlock.js.map