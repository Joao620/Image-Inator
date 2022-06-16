import { loadImage } from 'canvas'
import {createMosaicImage} from './src/index'
import { readFileSync, writeFileSync } from 'fs'

const promiseImagem = loadImage('./paisagem.jpg')
const promisePixagemAtals = loadImage('./test/data/piximage/minecraft/imagem.png')
const coresPixagem = JSON.parse(readFileSync('./test/data/piximage/minecraft/cores.json', 'utf-8'))

Promise.all([promiseImagem, promisePixagemAtals]).then(function([imagem, pixagemAtlas]){
    createMosaicImage(
        imagem,
        coresPixagem,
        pixagemAtlas,
        {
            aspectRatio: .5,
            reducaoImagemFinal: .5,
            cpuMode: false
        }
    ).then(canvas => writeFileSync('imagem.png', canvas.toBuffer('image/png', {compressionLevel: 2})))
})
