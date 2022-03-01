import { cor, Imagem } from "../types";
export default function gerarPixagem(imagensCodificadas: Imagem[], proporcaoEscolida: number, reducaoTamanho: number): Promise<[Imagem, cor[]]>;
export declare function criarBlocaoImagem(imagens: Imagem[], proporcaoEscolida: number, reducaoTamanho: number): Promise<import("canvas").Canvas>;
