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
const criarMosaicoImagem_1 = __importDefault(require("./criarMosaicoImagem"));
const fs_1 = require("fs");
const path_1 = require("path");
const canvas_1 = require("canvas");
function nodeWrapper(imagePath, piximageDir, cpuMode, proporcaoPiximagem) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, fs_1.existsSync)(piximageDir))
            throw 'Piximage dir dosen\'t exist';
        if (!(0, fs_1.existsSync)(imagePath))
            throw 'The image Path dosen\'t exist';
        if (!(0, fs_1.existsSync)((0, path_1.join)(piximageDir, 'seed.json')))
            throw 'The seed.json dosen\'t exist';
        if (!(0, fs_1.existsSync)((0, path_1.join)(piximageDir, 'piximage.png')))
            throw 'The piximage.png dosen\'t exist';
        const imagemParaMosaico = yield (0, canvas_1.loadImage)(imagePath);
        const imagemPixagem = yield (0, canvas_1.loadImage)((0, path_1.join)(piximageDir, 'piximage.png'));
        const piximageConfigBuffer = (0, fs_1.readFileSync)((0, path_1.join)(piximageDir, 'seed.json'), 'utf8');
        const piximageConfig = JSON.parse(piximageConfigBuffer);
        const cores = Object.values(piximageConfig);
        yield (0, criarMosaicoImagem_1.default)(imagemParaMosaico, cores, imagemPixagem, proporcaoPiximagem, cpuMode);
    });
}
exports.default = nodeWrapper;
