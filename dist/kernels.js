"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BFKNNS = exports.calcularMediaCores = void 0;
//imagem com os eixos imagem[y][x], centro top left
function calcularMediaCores(imagem) {
    var somaR = 0;
    var somaG = 0;
    var somaB = 0;
    var larguraDivisao = this.constants.largura / this.constants.divisoesLargura;
    var alturaDivisao = this.constants.altura / this.constants.divisoesAltura;
    var initX = larguraDivisao * this.thread.x;
    var initY = alturaDivisao * this.thread.y;
    for (var x = initX; x < initX + larguraDivisao; x++) {
        for (var y = initY; y < initY + alturaDivisao; y++) {
            somaR += imagem[x][y][0] * imagem[x][y][0];
            somaG += imagem[x][y][1] * imagem[x][y][1];
            somaB += imagem[x][y][2] * imagem[x][y][2];
        }
    }
    var totalPixels = larguraDivisao * alturaDivisao;
    somaR = Math.sqrt(somaR / totalPixels);
    somaG = Math.sqrt(somaG / totalPixels);
    somaB = Math.sqrt(somaB / totalPixels);
    return [somaR, somaG, somaB];
}
exports.calcularMediaCores = calcularMediaCores;
function BFKNNS(coresImagemMosaico, corPixagem) {
    var _a = this.thread, x = _a.x, y = _a.y;
    var threadCor = coresImagemMosaico[y][x];
    var pixagemMaisProxima = 0.0;
    var valorPixagemMaisProxima = 99999999.0;
    for (var i = 0; i < this.constants.quantCoresPixagem; i++) {
        var pixagemAtual = corPixagem[i];
        var catetoX = Math.abs(pixagemAtual[0] - threadCor[0]);
        var catetoY = Math.abs(pixagemAtual[1] - threadCor[1]);
        var catetoZ = Math.abs(pixagemAtual[2] - threadCor[2]);
        var distancia = catetoX + catetoY + catetoZ;
        if (distancia < valorPixagemMaisProxima) {
            pixagemMaisProxima = i;
            valorPixagemMaisProxima = distancia;
        }
    }
    return pixagemMaisProxima;
}
exports.BFKNNS = BFKNNS;
//Array2d(2)
//export function criarImagemFinal(this: criarImagemFinalThis, piximagensMaisProximas: number[][][], pixagensImagem: number[][][]){
//const pixAtualX = Math.floor(this.thread.x / this.constants.larguraPiximagens)
//const pixAtualY = Math.floor(this.thread.y / this.constants.alturaPiximagens)
//const piximagemEscolhida = piximagensMaisProximas[pixAtualX][pixAtualY][0]
//const dentroPixagemX = this.thread.x - (pixAtualX * this.constants.larguraPiximagens)
//const dentroPixagemY = this.thread.y - (pixAtualY * this.constants.alturaPiximagens)
//const finalX = dentroPixagemX
//const finalY = dentroPixagemY + (piximagemEscolhida * this.constants.alturaPiximagens)
////const pixelPiximagem = pixagensImagem[pixAtualX][pixAtualY * this.constants.alturaPiximagens]
//}
//# sourceMappingURL=kernels.js.map