import GPU, {IGPUKernelSettings} from 'gpu.js'
import { createCanvas, Image } from 'node-canvas'
import { cor } from './types'

import { calcularMediaCores, BFKNNS } from './kernels'

export default function comparar(larguraPiximagem: number, alturaPiximagem: number, cores: cor[], imagemPrincipal: Image, porcentagemTamanho: number){

  const tamanhoDivisoesLargura = Math.max(Math.round(larguraPiximagem * porcentagemTamanho), 1)
  const tamanhoDivisoesAltura = Math.max(Math.round(alturaPiximagem * porcentagemTamanho), 1)

  const quantidadeDivisoesLargura = Math.floor(imagemPrincipal.width / tamanhoDivisoesLargura)
  const quantidadeDivisoesAltura = Math.floor(imagemPrincipal.height / tamanhoDivisoesAltura)

  const novaLargura = tamanhoDivisoesLargura * quantidadeDivisoesLargura
  const novaAltura = tamanhoDivisoesAltura * quantidadeDivisoesAltura

  const imagemPrincipalCortada = createCanvas(novaLargura, novaAltura)
  const ctx = imagemPrincipalCortada.getContext('2d')

  ctx.drawImage(imagemPrincipal, 0, 0)

  const imagemPrincipalCortadaID = ctx.getImageData(0, 0, novaLargura, novaAltura)

  const coresImagemPrincipal = mediaCoresDivisoes(imagemPrincipalCortadaID, quantidadeDivisoesLargura, quantidadeDivisoesAltura)

  return compararBlocosParecidos(coresImagemPrincipal, cores)
}

//vai dividir a imagem em varios quadrantes e pegar a media de cores neles
function mediaCoresDivisoes(blocao: ImageData, quantDivisoesLargura: number, quantDivisoesAltura: number){
  const gpu = new GPU.GPU()

  const configs = {
    output: [quantDivisoesLargura, quantDivisoesAltura],
    constants: {largura: blocao.width, altura: blocao.height, divisoesLargura: quantDivisoesLargura, divisoesAltura: quantDivisoesAltura}
  }

  const kernelCores = gpu.createKernel(calcularMediaCores, configs)

  // a porra da biblioteca nao aceita uInt8clampedarray, mas funciona normal
  // @ts-expect-error
  const imagemDimensional = new GPU.Input(blocao.data, [4, blocao.width, blocao.height])

  const resultadoKernelCores = kernelCores(imagemDimensional) as Float32Array[][]

  let resultadoCores: cor[][] = resultadoKernelCores.map(arr => {
    return arr.map(valor => {
      return {
        r: valor[0],
        g: valor[1],
        b: valor[2]
      }
    })
  })

  //isso e pra fazer transpose da matrix, ja que ela vem errada do kernel
  //transpose e como se fosse trocar as linahs pelas colunas
  for (let row = 0; row < resultadoCores.length; row++) {
    for (let column = 0; column < row; column++) {
      let temp = resultadoCores[row][column]
      resultadoCores[row][column] = resultadoCores[column][row]
      resultadoCores[column][row] = temp
    }
  }

  return resultadoCores
}

function compararBlocosParecidos(mediaCoresMosaico: cor[][], coresPixagem: cor[]){
  const mediaCoresMosaicoValues = mediaCoresMosaico.map(arr => (
    arr.map(cor => Object.values(cor))
  ))

  const coresPixagemValues = coresPixagem.map(cor => (
    Object.values(cor)
  ))

  const gpu = new GPU.GPU()

  const configs: IGPUKernelSettings = {
    output: [mediaCoresMosaico.length, mediaCoresMosaico[0].length],
    constants: {quantCoresPixagem: coresPixagem.length},
    argumentTypes: {coresImagemMosaico: 'Array2D(3)', coresPixagem: 'Array1D(3)'},
  }

  const kernelCores = gpu.createKernel(BFKNNS, configs)

  const resultadoKernelCores = kernelCores(mediaCoresMosaicoValues, coresPixagemValues) as Float32Array[][]

  return resultadoKernelCores
}
