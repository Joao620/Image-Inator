export interface Imagem {
    dados: Uint8Array
    largura: number
    altura: number
}

export interface ImagemComNome extends Imagem {
    nome: string
}

export type cor = [number, number, number]

export interface ColecaoPixagem {
  readonly imagem: Image
  readonly larguraIndividual: number
  readonly alturaIndividial: number
  readonly quantidadePixagens: number
  readonly cores: cor[]
}

export interface ImagemParaMosaico {
  readonly imagem: ImageData
  readonly quantDivisoesLargura: number
  readonly quantDivisoesAltura: number
  readonly tamDivisoesLargura: number
  readonly tamDivisoesAltura: number
}
