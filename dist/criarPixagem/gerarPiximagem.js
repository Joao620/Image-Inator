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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var promises_1 = require("fs/promises");
var path_1 = require("path");
var image_size_1 = __importDefault(require("image-size"));
var createImageBlock_1 = __importDefault(require("./createImageBlock"));
function lerImagensDePasta(caminhoPasta) {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function () {
        var dir, listaNomesImagens, regexImagem, dir_1, dir_1_1, dirent, e_1_1, bufferImagensEmEspera, listaNomesImagens_1, listaNomesImagens_1_1, nomeImagem, caminhoImagem, saida, i, nomeImagem, bufferCodificado, _b, largua, altura;
        var e_2, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!(0, fs_1.existsSync)(caminhoPasta)) {
                        throw new Error("pasta nao existe");
                    }
                    return [4 /*yield*/, (0, promises_1.opendir)(caminhoPasta)];
                case 1:
                    dir = _d.sent();
                    listaNomesImagens = [];
                    regexImagem = /(jpg|jpeg|png)$/;
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, 7, 8, 13]);
                    dir_1 = __asyncValues(dir);
                    _d.label = 3;
                case 3: return [4 /*yield*/, dir_1.next()];
                case 4:
                    if (!(dir_1_1 = _d.sent(), !dir_1_1.done)) return [3 /*break*/, 6];
                    dirent = dir_1_1.value;
                    if (dirent.isFile() && regexImagem.test(dirent.name)) {
                        listaNomesImagens.push(dirent.name);
                    }
                    _d.label = 5;
                case 5: return [3 /*break*/, 3];
                case 6: return [3 /*break*/, 13];
                case 7:
                    e_1_1 = _d.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 13];
                case 8:
                    _d.trys.push([8, , 11, 12]);
                    if (!(dir_1_1 && !dir_1_1.done && (_a = dir_1.return))) return [3 /*break*/, 10];
                    return [4 /*yield*/, _a.call(dir_1)];
                case 9:
                    _d.sent();
                    _d.label = 10;
                case 10: return [3 /*break*/, 12];
                case 11:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 12: return [7 /*endfinally*/];
                case 13:
                    bufferImagensEmEspera = [];
                    try {
                        for (listaNomesImagens_1 = __values(listaNomesImagens), listaNomesImagens_1_1 = listaNomesImagens_1.next(); !listaNomesImagens_1_1.done; listaNomesImagens_1_1 = listaNomesImagens_1.next()) {
                            nomeImagem = listaNomesImagens_1_1.value;
                            caminhoImagem = (0, path_1.join)(caminhoPasta, nomeImagem);
                            bufferImagensEmEspera.push((0, promises_1.readFile)(caminhoImagem));
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (listaNomesImagens_1_1 && !listaNomesImagens_1_1.done && (_c = listaNomesImagens_1.return)) _c.call(listaNomesImagens_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    saida = [];
                    i = 0;
                    _d.label = 14;
                case 14:
                    if (!(i < listaNomesImagens.length)) return [3 /*break*/, 17];
                    nomeImagem = listaNomesImagens[i];
                    return [4 /*yield*/, bufferImagensEmEspera[i]];
                case 15:
                    bufferCodificado = _d.sent();
                    _b = (0, image_size_1.default)(bufferCodificado), largua = _b.width, altura = _b.height;
                    if (largua === undefined || altura === undefined)
                        throw "imagem ".concat(nomeImagem, " esta com uma das dimensoes corrompidas sla");
                    saida.push({
                        nome: nomeImagem,
                        dados: bufferCodificado,
                        largura: largua,
                        altura: altura,
                    });
                    _d.label = 16;
                case 16:
                    i++;
                    return [3 /*break*/, 14];
                case 17: return [2 /*return*/, saida];
            }
        });
    });
}
function salvarPixagem(blocaoPixagens, cores, nomesImagens, pastaSaida) {
    return __awaiter(this, void 0, void 0, function () {
        var dadosImagens, i, dadosImagensJson;
        return __generator(this, function (_a) {
            dadosImagens = {};
            for (i = 0; i < nomesImagens.length; i++) {
                dadosImagens[nomesImagens[i]] = cores[i];
            }
            dadosImagensJson = JSON.stringify(dadosImagens);
            (0, promises_1.writeFile)((0, path_1.join)(pastaSaida, 'seed.json'), dadosImagensJson);
            (0, promises_1.writeFile)((0, path_1.join)(pastaSaida, 'piximage.png'), blocaoPixagens.dados);
            return [2 /*return*/];
        });
    });
}
function gerarPiximage(imagesDir, outputDir) {
    return __awaiter(this, void 0, void 0, function () {
        var imagens, listaNomes, _a, blocao, cores;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, lerImagensDePasta(imagesDir)];
                case 1:
                    imagens = _b.sent();
                    listaNomes = imagens.map(function (v) { return v.nome; });
                    return [4 /*yield*/, (0, createImageBlock_1.default)(imagens, 1, 1)];
                case 2:
                    _a = __read.apply(void 0, [_b.sent(), 2]), blocao = _a[0], cores = _a[1];
                    salvarPixagem(blocao, cores, listaNomes, outputDir);
                    return [2 /*return*/];
            }
        });
    });
}
exports.default = gerarPiximage;
//# sourceMappingURL=gerarPiximagem.js.map