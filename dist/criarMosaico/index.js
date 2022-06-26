"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const canvas_1 = require("canvas");
async function nodeWrapper(imagePath, piximageDir, cpuMode, proporcaoPiximagem) {
    if (!(0, fs_1.existsSync)(piximageDir))
        throw 'Piximage dir dosen\'t exist';
    if (!(0, fs_1.existsSync)(imagePath))
        throw 'The image Path dosen\'t exist';
    if (!(0, fs_1.existsSync)((0, path_1.join)(piximageDir, 'seed.json')))
        throw 'The seed.json dosen\'t exist';
    if (!(0, fs_1.existsSync)((0, path_1.join)(piximageDir, 'piximage.png')))
        throw 'The piximage.png dosen\'t exist';
    const imagemParaMosaico = await (0, canvas_1.loadImage)(imagePath);
    const imagemPixagem = await (0, canvas_1.loadImage)((0, path_1.join)(piximageDir, 'piximage.png'));
    const piximageConfigBuffer = (0, fs_1.readFileSync)((0, path_1.join)(piximageDir, 'seed.json'), 'utf8');
    const piximageConfig = JSON.parse(piximageConfigBuffer);
    const cores = Object.values(piximageConfig);
}
exports.default = nodeWrapper;
//# sourceMappingURL=index.js.map