import GPU from 'gpu.js'
import type { IGPUKernelSettings, IKernelRunShortcut } from 'gpu.js'
import { calcularMediaCores, BFKNNS } from '../kernels'
import type {ColecaoPixagem, cor, ImagemParaMosaico} from '../types'

export default function comparar(kernelComparacao: IKernelRunShortcut, colecaoPixagem: ColecaoPixagem, imagemParaMosaico: ImagemParaMosaico){
  const cpuMode = true
  const { imagem, quantDivisoesLargura, quantDivisoesAltura } = imagemParaMosaico
  const coresImagemPrincipal = mediaCoresDivisoes(imagem, quantDivisoesLargura, quantDivisoesAltura, cpuMode)

  const blocosParecidos =  compararBlocosParecidos(coresImagemPrincipal, colecaoPixagem.cores, cpuMode)
  
  return blocosParecidos
}

//vai dividir a imagem em varios quadrantes e pegar a media de cores neles
function mediaCoresDivisoes(imagem: ImageData, quantDivisoesLargura: number, quantDivisoesAltura: number, cpuMode: boolean){
  const gpu = new GPU.GPU({
    mode: cpuMode ? 'cpu' : 'gpu'
  })

  const configs = {
    output: [quantDivisoesAltura, quantDivisoesLargura],
    constants: {largura: imagem.width, altura: imagem.height, divisoesLargura: quantDivisoesLargura, divisoesAltura: quantDivisoesAltura}
  }

  const kernelCores = gpu.createKernel(calcularMediaCores, configs)

  // a porra da biblioteca nao aceita uInt8clampedarray, mas funciona normal
  // @ts-expect-error
  const imagemDimensional = new GPU.Input(imagem.data, [4, imagem.width, imagem.height])

  const resultadoKernelCores = kernelCores(imagemDimensional) as cor[][]
  console.log(kernelCores.toString(imagemDimensional), '\n\n\n')

  return resultadoKernelCores
}

function compararBlocosParecidos(mediaCoresMosaico: cor[][], coresPixagem: cor[], cpuMode: boolean){
  const gpu = new GPU.GPU({
    mode: cpuMode ? 'cpu' : 'gpu'
  })

  const configs: IGPUKernelSettings = {
    output: [mediaCoresMosaico[0].length, mediaCoresMosaico.length],
    constants: {quantCoresPixagem: coresPixagem.length},
    argumentTypes: {coresImagemMosaico: 'Array2D(3)', coresPixagem: 'Array1D(3)'},
  }

  const kernelCores: IKernelRunShortcut = gpu.createKernel(BFKNNS, configs)

  const resultadoKernelCores = kernelCores(mediaCoresMosaico, coresPixagem) as Float32Array[]

  console.log(kernelCores.toString(mediaCoresMosaico, coresPixagem), '\n\n\n')

  return resultadoKernelCores
}
