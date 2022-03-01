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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const image_size_1 = __importDefault(require("image-size"));
const createImageBlock_1 = __importDefault(require("./createImageBlock"));
function lerImagensDePasta(caminhoPasta) {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, fs_1.existsSync)(caminhoPasta)) {
            throw new Error("pasta nao existe");
        }
        const dir = yield (0, promises_1.opendir)(caminhoPasta);
        const listaNomesImagens = [];
        const regexImagem = /(jpg|jpeg|png)$/;
        try {
            for (var dir_1 = __asyncValues(dir), dir_1_1; dir_1_1 = yield dir_1.next(), !dir_1_1.done;) {
                const dirent = dir_1_1.value;
                if (dirent.isFile() && regexImagem.test(dirent.name)) {
                    listaNomesImagens.push(dirent.name);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (dir_1_1 && !dir_1_1.done && (_a = dir_1.return)) yield _a.call(dir_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        const bufferImagensEmEspera = [];
        for (const nomeImagem of listaNomesImagens) {
            const caminhoImagem = (0, path_1.join)(caminhoPasta, nomeImagem);
            bufferImagensEmEspera.push((0, promises_1.readFile)(caminhoImagem));
        }
        const saida = [];
        for (let i = 0; i < listaNomesImagens.length; i++) {
            const nomeImagem = listaNomesImagens[i];
            const bufferCodificado = yield bufferImagensEmEspera[i];
            const { width: largua, height: altura } = (0, image_size_1.default)(bufferCodificado);
            if (largua === undefined || altura === undefined)
                throw `imagem ${nomeImagem} esta com uma das dimensoes corrompidas sla`;
            saida.push({
                nome: nomeImagem,
                dados: bufferCodificado,
                largura: largua,
                altura,
            });
        }
        return saida;
    });
}
function salvarPixagem(blocaoPixagens, cores, nomesImagens, pastaSaida) {
    return __awaiter(this, void 0, void 0, function* () {
        const dadosImagens = {};
        for (let i = 0; i < nomesImagens.length; i++) {
            dadosImagens[nomesImagens[i]] = cores[i];
        }
        const dadosImagensJson = JSON.stringify(dadosImagens);
        (0, promises_1.writeFile)((0, path_1.join)(pastaSaida, 'seed.json'), dadosImagensJson);
        (0, promises_1.writeFile)((0, path_1.join)(pastaSaida, 'piximage.png'), blocaoPixagens.dados);
    });
}
function gerarPiximage(imagesDir, outputDir) {
    return __awaiter(this, void 0, void 0, function* () {
        const imagens = yield lerImagensDePasta(imagesDir);
        const listaNomes = imagens.map(v => v.nome);
        const [blocao, cores] = yield (0, createImageBlock_1.default)(imagens, 1, 1);
        salvarPixagem(blocao, cores, listaNomes, outputDir);
    });
}
exports.default = gerarPiximage;
