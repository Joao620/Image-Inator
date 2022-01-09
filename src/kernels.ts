import { IKernelFunctionThis } from 'gpu.js';

interface calcularMediaCoresThis extends IKernelFunctionThis{
  constants: {altura: number, largura: number, divisoesAltura: number, divisoesLargura: number}
}

//imagem com os eixos imagem[y][x], centro top left
export function calcularMediaCores(this: calcularMediaCoresThis, imagem: number[][][]): number[]{
    let somaR = 0
    let somaG = 0
    let somaB = 0

    let larguraDivisao = this.constants.largura / this.constants.divisoesLargura
    let alturaDivisao = this.constants.altura / this.constants.divisoesAltura

    let initX = larguraDivisao * this.thread.x
    let initY = alturaDivisao * this.thread.y

    for(let x = initX; x < initX + larguraDivisao; x++){
      for(let y = initY; y < initY + alturaDivisao; y++){
        somaR += imagem[x][y][0] * imagem[x][y][0]
        somaG += imagem[x][y][1] * imagem[x][y][1]
        somaB += imagem[x][y][2] * imagem[x][y][2]
      }
    }

    let totalPixels = larguraDivisao * alturaDivisao

    somaR = Math.sqrt(somaR / totalPixels)
    somaG = Math.sqrt(somaG / totalPixels)
    somaB = Math.sqrt(somaB / totalPixels)

    return [somaR, somaG, somaB]
}

interface BFKNNSThis extends IKernelFunctionThis {
  constants: {quantCoresPixagem: number}
}

export function BFKNNS(this: BFKNNSThis, coresImagemMosaico: number[][][], corPixagem: number[][]){
  const { x, y } = this.thread
  const threadCor = coresImagemMosaico[y][x]

  let pixagemMaisProxima = 0.0
  let valorPixagemMaisProxima = 99999999.0

  for(let i = 0; i < this.constants.quantCoresPixagem; i++){

    const pixagemAtual = corPixagem[i]

    const catetoX = Math.abs(pixagemAtual[0] - threadCor[0])
    const catetoY = Math.abs(pixagemAtual[1] - threadCor[1])
    const catetoZ = Math.abs(pixagemAtual[2] - threadCor[2])

    const distancia = catetoX + catetoY + catetoZ

    if(distancia < valorPixagemMaisProxima){
      pixagemMaisProxima = i
      valorPixagemMaisProxima = distancia
    }

  }

  return pixagemMaisProxima

}

interface criarImagemFinalThis extends IKernelFunctionThis {
  constants: { alturaImg: number, larguraImg: number, alturaPiximagens: number, larguraPiximagens: number, quantPiximagem: number }
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
