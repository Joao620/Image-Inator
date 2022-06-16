import { cor, Imagem, OpcoesPixImage } from "../types";
export default function gerarPixagem(imagensCodificadas: Imagem[], opcoesPixImage: OpcoesPixImage): Promise<[Imagem, cor[]]>;
export declare function criarBlocaoImagem(imagens: Imagem[], aspectRatio: number, reducaoTamanho: number): Promise<import("canvas").Canvas>;
//# sourceMappingURL=createImageBlock.d.ts.map