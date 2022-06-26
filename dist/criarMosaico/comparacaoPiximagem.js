"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gpu_js_1 = __importDefault(require("gpu.js"));
const kernels_1 = require("../kernels");
function comparar(kernelComparacao, colecaoPixagem, imagemParaMosaico) {
    const cpuMode = true;
    const { imagem, quantDivisoesLargura, quantDivisoesAltura } = imagemParaMosaico;
    const coresImagemPrincipal = mediaCoresDivisoes(imagem, quantDivisoesLargura, quantDivisoesAltura, cpuMode);
    const blocosParecidos = compararBlocosParecidos(coresImagemPrincipal, colecaoPixagem.cores, cpuMode);
    return blocosParecidos;
}
exports.default = comparar;
function mediaCoresDivisoes(imagem, quantDivisoesLargura, quantDivisoesAltura, cpuMode) {
    const gpu = new gpu_js_1.default.GPU({
        mode: cpuMode ? 'cpu' : 'gpu'
    });
    const configs = {
        output: [quantDivisoesAltura, quantDivisoesLargura],
        constants: { largura: imagem.width, altura: imagem.height, divisoesLargura: quantDivisoesLargura, divisoesAltura: quantDivisoesAltura }
    };
    const kernelCores = gpu.createKernel(kernels_1.calcularMediaCores, configs);
    const imagemDimensional = new gpu_js_1.default.Input(imagem.data, [4, imagem.width, imagem.height]);
    const resultadoKernelCores = kernelCores(imagemDimensional);
    console.log(kernelCores.toString(imagemDimensional), '\n\n\n');
    return resultadoKernelCores;
}
function compararBlocosParecidos(mediaCoresMosaico, coresPixagem, cpuMode) {
    const gpu = new gpu_js_1.default.GPU({
        mode: cpuMode ? 'cpu' : 'gpu'
    });
    const configs = {
        output: [mediaCoresMosaico[0].length, mediaCoresMosaico.length],
        constants: { quantCoresPixagem: coresPixagem.length },
        argumentTypes: { coresImagemMosaico: 'Array2D(3)', coresPixagem: 'Array1D(3)' },
    };
    const kernelCores = gpu.createKernel(kernels_1.BFKNNS, configs);
    const resultadoKernelCores = kernelCores(mediaCoresMosaico, coresPixagem);
    console.log(kernelCores.toString(mediaCoresMosaico, coresPixagem), '\n\n\n');
    return resultadoKernelCores;
}
//# sourceMappingURL=comparacaoPiximagem.js.map