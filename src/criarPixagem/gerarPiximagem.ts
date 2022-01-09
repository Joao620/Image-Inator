import { existsSync } from "fs";
import { opendir, readFile, writeFile } from "fs/promises";
import { join } from "path";

import imageSize from "image-size";

import { cor, Imagem, ImagemComNome } from '../types'

import gerarPixagem from './createImageBlock'

async function lerImagensDePasta(caminhoPasta: string): Promise<ImagemComNome[]> {
  if (!existsSync(caminhoPasta)) {
    throw new Error("pasta nao existe");
  }
  const dir = await opendir(caminhoPasta);

  const listaNomesImagens: string[] = [];
  const regexImagem = /(jpg|jpeg|png)$/;
  for await (const dirent of dir) {
    if (dirent.isFile() && regexImagem.test(dirent.name)) {
      listaNomesImagens.push(dirent.name);
    }
  }

  const bufferImagensEmEspera: Promise<Buffer>[] = [];
  for (const nomeImagem of listaNomesImagens) {
    const caminhoImagem = join(caminhoPasta, nomeImagem);
    bufferImagensEmEspera.push(readFile(caminhoImagem));
  }

  const saida: ImagemComNome[] =[]

  for (let i = 0; i < listaNomesImagens.length; i++) {
    const nomeImagem = listaNomesImagens[i];

    const bufferCodificado = await bufferImagensEmEspera[i];

    const {width: largua, height: altura} = imageSize(bufferCodificado)
    if(largua === undefined || altura === undefined) throw `imagem ${nomeImagem} esta com uma das dimensoes corrompidas sla`
    
    saida.push({
        nome: nomeImagem,
        dados: bufferCodificado,
        largura: largua,
        altura,
    })

  }

  return saida;
}

async function salvarPixagem(blocaoPixagens: Imagem, cores: cor[], nomesImagens: string[], pastaSaida: string){
  const dadosImagens: {[key: string]: cor} = {}

  for(let i = 0; i < nomesImagens.length; i++){
    dadosImagens[nomesImagens[i]] = cores[i]
  }

  const dadosImagensJson = JSON.stringify(dadosImagens)  

  writeFile(join(pastaSaida, 'seed.json'), dadosImagensJson)
  writeFile(join(pastaSaida, 'piximage.png'), blocaoPixagens.dados)
}

export default async function gerarPiximage(imagesDir: string, outputDir: string) {
  const imagens = await lerImagensDePasta(imagesDir)
  const listaNomes = imagens.map(v => v.nome)
  const [blocao, cores] = await gerarPixagem(imagens, 1, 1)
  salvarPixagem(blocao, cores, listaNomes, outputDir)
}
