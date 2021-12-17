import { existsSync, readFileSync } from "fs";
import { join } from "path";

import imageSize from "image-size";

import comparar from "./comparacaoPiximagem";

import { cor } from './types'

import { createCanvas, loadImage } from "node-canvas";
export default async function createImageMosaic(piximageDir: string, imagePath: string){
  if(!existsSync(piximageDir)) throw 'Piximage dir dosen\'t exist'
  if(!existsSync(imagePath)) throw 'The image Path dosen\'t exist'
  if(!existsSync(join(piximageDir, 'seed.json'))) throw 'The seed.json dosen\'t exist'
  if(!existsSync(join(piximageDir, 'piximage.png'))) throw 'The piximage.png dosen\'t exist'


  const piximagemMaisProximas = await pegarCoresMaisProximas(piximageDir, imagePath)

  //const piximagem = await loadImage(join(piximageDir, 'piximage.png'))

}

async function pegarCoresMaisProximas(piximageDir: string, imagePath: string){
  const tamPiximagem = imageSize(join(piximageDir, 'piximage.png'))
  if(!tamPiximagem.width || !tamPiximagem.height) throw 'could\'t get the image to mosaic size'

  const piximageConfigBuffer = readFileSync(join(piximageDir, 'seed.json'), 'utf8')
  const piximageConfig = JSON.parse(piximageConfigBuffer)
  const cores = Object.values(piximageConfig) as cor[]

  const imagemMosaico = await loadImage(imagePath)

  return comparar(tamPiximagem.width, tamPiximagem.height, cores, imagemMosaico, 1)
}

async function gerarImagemMosaico(escolhasPixagem: Float32Array[][], piximagemPath: string, proporcaoPiximagem: number, larguraMosaico: number, alturaMosaico: number){
  const piximagemImagem = await loadImage(piximagemPath)
  
}

function recalcularDimensoes(proporcaoPiximagem: number, alturaPiximagens: number, larguraPiximagens: number, alturaImg: number, larguraImg: number){
  const novaLarguraPixagens = Math.max(Math.round(larguraPiximagem * porcentagemTamanho), 1)
  const novaAlturaPixagens = Math.max(Math.round(alturaPiximagem * porcentagemTamanho), 1)

  const quantidadeDivisoesLargura = Math.floor(imagemPrincipal.width / tamanhoDivisoesLargura)
  const quantidadeDivisoesAltura = Math.floor(imagemPrincipal.height / tamanhoDivisoesAltura)

  const novaLargura = tamanhoDivisoesLargura * quantidadeDivisoesLargura
  const novaAltura = tamanhoDivisoesAltura * quantidadeDivisoesAltura

}
