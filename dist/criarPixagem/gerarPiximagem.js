"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const image_size_1 = __importDefault(require("image-size"));
const createImageBlock_1 = __importDefault(require("./createImageBlock"));
async function lerImagensDaPasta(caminhoPasta) {
    if (!(0, fs_1.existsSync)(caminhoPasta)) {
        throw new Error("pasta nao existe");
    }
    const dir = await (0, promises_1.opendir)(caminhoPasta);
    const listaNomesImagens = [];
    const regexImagem = /(jpg|jpeg|png)$/;
    for await (const dirent of dir) {
        if (dirent.isFile() && regexImagem.test(dirent.name)) {
            listaNomesImagens.push(dirent.name);
        }
    }
    const bufferImagensEmEspera = [];
    for (const nomeImagem of listaNomesImagens) {
        const caminhoImagem = (0, path_1.join)(caminhoPasta, nomeImagem);
        bufferImagensEmEspera.push((0, promises_1.readFile)(caminhoImagem));
    }
    const saida = [];
    for (let i = 0; i < listaNomesImagens.length; i++) {
        const nomeImagem = listaNomesImagens[i];
        const bufferCodificado = await bufferImagensEmEspera[i];
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
}
async function salvarPixagem(blocaoPixagens, cores, nomesImagens, pastaSaida) {
    const dadosImagens = {};
    for (let i = 0; i < nomesImagens.length; i++) {
        dadosImagens[nomesImagens[i]] = cores[i];
    }
    const dadosImagensJson = JSON.stringify(dadosImagens);
    (0, promises_1.writeFile)((0, path_1.join)(pastaSaida, 'seed.json'), dadosImagensJson);
    (0, promises_1.writeFile)((0, path_1.join)(pastaSaida, 'piximage.png'), blocaoPixagens.dados);
}
async function gerarPiximage(imagesDir, opcoesPixImage) {
    const imagens = await lerImagensDaPasta(imagesDir);
    const listaNomes = imagens.map(v => v.nome);
    const [blocao, cores] = await (0, createImageBlock_1.default)(imagens, opcoesPixImage);
    return {
        blocao,
        cores,
        listaNomes
    };
}
exports.default = gerarPiximage;
//# sourceMappingURL=gerarPiximagem.js.map