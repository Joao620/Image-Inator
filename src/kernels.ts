import { IConstantsThis, IKernelFunctionThis } from "gpu.js";

interface calcularMediaCoresThis extends IKernelFunctionThis {
  constants: {
    tamDivisoesLargura: number,
    tamDivisoesAltura: number,
  };
}

//imagem com os eixos imagem[y][x], centro top left
export function calcularMediaCores(
  this: calcularMediaCoresThis,
  imagem: number[][][],
  tamDivisoesLargura: number,
  tamDivisoesAltura: number
) {
  let somaR = 0;
  let somaG = 0;
  let somaB = 0;
  let initX = tamDivisoesLargura * this.thread.x;
  let initY = tamDivisoesAltura * this.thread.y;

  for (let x = initX; x < initX + tamDivisoesLargura; x++) {
    for (let y = initY; y < initY + tamDivisoesAltura; y++) {
      somaR += imagem[y][x][0] * imagem[y][x][0];
      somaG += imagem[y][x][1] * imagem[y][x][1];
      somaB += imagem[y][x][2] * imagem[y][x][2];
    }
  }

  let totalPixels = tamDivisoesLargura * tamDivisoesAltura;


  somaR = Math.sqrt(somaR / totalPixels);
  somaG = Math.sqrt(somaG / totalPixels);
  somaB = Math.sqrt(somaB / totalPixels);

  return [somaR, somaG, somaB];
}

interface BFKNNSThis extends IKernelFunctionThis {
  constants: { quantCoresPixagem: number }
}

export function BFKNNS(
  this: BFKNNSThis,
  coresImagemMosaico: number[][][],
  corPixagem: number[][],
): number {
  const { x, y } = this.thread;
  const threadCor = coresImagemMosaico[y][x];

  let pixagemMaisProxima = 0;
  let valorPixagemMaisProxima = 99999999;

  let segundaPixagemMaisProxima = 0;
  let segundoValorPixagemMaisProxima = 99999999;

  for (let i = 0; i < this.constants.quantCoresPixagem; i++) {
    const pixagemAtual = corPixagem[i];

    const catetoX = Math.abs(pixagemAtual[0] - threadCor[0]);
    const catetoY = Math.abs(pixagemAtual[1] - threadCor[1]);
    const catetoZ = Math.abs(pixagemAtual[2] - threadCor[2]);

    const distancia = catetoX + catetoY + catetoZ;

    if (distancia < valorPixagemMaisProxima) {
      segundaPixagemMaisProxima = pixagemMaisProxima;
      segundoValorPixagemMaisProxima = valorPixagemMaisProxima;
      pixagemMaisProxima = i;
      valorPixagemMaisProxima = distancia;
    } else if (distancia < segundoValorPixagemMaisProxima) {
      segundaPixagemMaisProxima = i;
      segundoValorPixagemMaisProxima = distancia;
    }
  }

  let indexMatrix = [
    [0 / 4, 3 / 4],
    [2 / 4, 1 / 4],
  ];

  let matrixX = x % 2;
  let matrixY = y % 2;

  //let distanciaTotal = segundoValorPixagemMaisProxima - primeiroValorPixagemMaisProxima;
  const proximidadePixagemMaisProxima =
    (segundaPixagemMaisProxima - pixagemMaisProxima) /
    (segundaPixagemMaisProxima + pixagemMaisProxima);

  return proximidadePixagemMaisProxima < indexMatrix[matrixX][matrixY]
    ? pixagemMaisProxima
    : segundaPixagemMaisProxima;

  //return [pixagemMaisProxima, segundaPixagemMaisProxima]
}

interface criarImagemFinalThis extends IKernelFunctionThis {
  constants: {
    alturaImg: number;
    larguraImg: number;
    alturaPiximagens: number;
    larguraPiximagens: number;
    quantPiximagem: number;
  };
}

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
