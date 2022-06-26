import criarImagemMosaico from "./criarMosaicoImagem";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { loadImage } from "canvas";
import { cor, OpcoesCriarMosaico } from '../types'

export default async function nodeWrapper(imagePath: string, piximageDir: string, cpuMode: boolean, proporcaoPiximagem: number){
  if(!existsSync(piximageDir)) throw 'Piximage dir dosen\'t exist'
  if(!existsSync(imagePath)) throw 'The image Path dosen\'t exist'
  if(!existsSync(join(piximageDir, 'seed.json'))) throw 'The seed.json dosen\'t exist'
  if(!existsSync(join(piximageDir, 'piximage.png'))) throw 'The piximage.png dosen\'t exist'

  const imagemParaMosaico = await loadImage(imagePath)

  const imagemPixagem = await loadImage(join(piximageDir, 'piximage.png'))
  
  const piximageConfigBuffer = readFileSync(join(piximageDir, 'seed.json'), 'utf8')
  const piximageConfig = JSON.parse(piximageConfigBuffer)
  const cores = Object.values(piximageConfig) as cor[]

  //const opcoesCriarMosaico: OpcoesCriarMosaico = {
    //cpuMode: false,
    //reducaoImagemFinal: 1,
    //aspectRatio: 1,
  //}

  //await criarImagemMosaico(imagemParaMosaico, cores, imagemPixagem, opcoesCriarMosaico)
}
