import { loadImage } from "canvas";
import { imageMosaicFactory } from "./index";
import { readFileSync, writeFileSync } from "fs";

const promiseImagem = loadImage("../colorido.png");
const promisePixagemAtals = loadImage(
  "../test/data/piximage/minecraft/imagem.png"
);
const coresPixagem = JSON.parse(
  readFileSync("../test/data/piximage/minecraft/cores.json", "utf-8")
);

Promise.all([promiseImagem, promisePixagemAtals]).then(function ([
  imagem,
  pixagemAtlas,
]) {
  const product = imageMosaicFactory(imagem, coresPixagem, pixagemAtlas, true);
  //product({ aspectRatio: 1, reducaoImagemFinal: 1 }).then((img) => {
      //writeFileSync('resultado.png', img.toBuffer())
    //}
  //)
  //
  product({aspectRatio: 1, reducaoImagemFinal: 1})
});
