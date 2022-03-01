"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var gpu_js_1 = __importDefault(require("gpu.js"));
var kernels_1 = require("../kernels");
function comparar(colecaoPixagem, imagemParaMosaico, cpuMode) {
    var imagem = imagemParaMosaico.imagem, quantDivisoesLargura = imagemParaMosaico.quantDivisoesLargura, quantDivisoesAltura = imagemParaMosaico.quantDivisoesAltura;
    var coresImagemPrincipal = mediaCoresDivisoes(imagem, quantDivisoesLargura, quantDivisoesAltura, cpuMode);
    var blocosParecidos = compararBlocosParecidos(coresImagemPrincipal, colecaoPixagem.cores, cpuMode);
    return blocosParecidos;
}
exports.default = comparar;
//vai dividir a imagem em varios quadrantes e pegar a media de cores neles
function mediaCoresDivisoes(imagem, quantDivisoesLargura, quantDivisoesAltura, cpuMode) {
    var gpu = new gpu_js_1.default.GPU({
        mode: cpuMode ? 'cpu' : 'gpu'
    });
    var configs = {
        output: [quantDivisoesAltura, quantDivisoesLargura],
        constants: { largura: imagem.width, altura: imagem.height, divisoesLargura: quantDivisoesLargura, divisoesAltura: quantDivisoesAltura }
    };
    var kernelCores = gpu.createKernel(kernels_1.calcularMediaCores, configs);
    // a porra da biblioteca nao aceita uInt8clampedarray, mas funciona normal
    // @ts-expect-error
    var imagemDimensional = new gpu_js_1.default.Input(imagem.data, [4, imagem.width, imagem.height]);
    var resultadoKernelCores = kernelCores(imagemDimensional);
    return resultadoKernelCores;
}
function compararBlocosParecidos(mediaCoresMosaico, coresPixagem, cpuMode) {
    var coresPixagemValues = coresPixagem.map(function (cor) { return (Object.values(cor)); });
    var gpu = new gpu_js_1.default.GPU({
        mode: cpuMode ? 'cpu' : 'gpu'
    });
    var configs = {
        output: [mediaCoresMosaico[0].length, mediaCoresMosaico.length],
        constants: { quantCoresPixagem: coresPixagem.length },
        argumentTypes: { coresImagemMosaico: 'Array2D(3)', coresPixagem: 'Array1D(3)' },
    };
    var kernelCores = gpu.createKernel(kernels_1.BFKNNS, configs);
    var resultadoKernelCores = kernelCores(mediaCoresMosaico, coresPixagemValues);
    return resultadoKernelCores;
}
//# sourceMappingURL=comparacaoPiximagem.js.map