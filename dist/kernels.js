"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BFKNNS = exports.calcularMediaCores = void 0;
function calcularMediaCores(imagem) {
    let somaR = 0;
    let somaG = 0;
    let somaB = 0;
    let larguraDivisao = this.constants.largura / this.constants.divisoesLargura;
    let alturaDivisao = this.constants.altura / this.constants.divisoesAltura;
    let initX = larguraDivisao * this.thread.x;
    let initY = alturaDivisao * this.thread.y;
    for (let x = initX; x < initX + larguraDivisao; x++) {
        for (let y = initY; y < initY + alturaDivisao; y++) {
            somaR += imagem[x][y][0] * imagem[x][y][0];
            somaG += imagem[x][y][1] * imagem[x][y][1];
            somaB += imagem[x][y][2] * imagem[x][y][2];
        }
    }
    let totalPixels = larguraDivisao * alturaDivisao;
    somaR = Math.sqrt(somaR / totalPixels);
    somaG = Math.sqrt(somaG / totalPixels);
    somaB = Math.sqrt(somaB / totalPixels);
    return [somaR, somaG, somaB];
}
exports.calcularMediaCores = calcularMediaCores;
function BFKNNS(coresImagemMosaico, corPixagem) {
    const { x, y } = this.thread;
    const threadCor = coresImagemMosaico[y][x];
    let pixagemMaisProxima = 0.0;
    let valorPixagemMaisProxima = 99999999.0;
    for (let i = 0; i < this.constants.quantCoresPixagem; i++) {
        const pixagemAtual = corPixagem[i];
        const catetoX = Math.abs(pixagemAtual[0] - threadCor[0]);
        const catetoY = Math.abs(pixagemAtual[1] - threadCor[1]);
        const catetoZ = Math.abs(pixagemAtual[2] - threadCor[2]);
        const distancia = catetoX + catetoY + catetoZ;
        if (distancia < valorPixagemMaisProxima) {
            pixagemMaisProxima = i;
            valorPixagemMaisProxima = distancia;
        }
    }
    return pixagemMaisProxima;
}
exports.BFKNNS = BFKNNS;
