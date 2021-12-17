export interface Imagem {
    dados: Uint8Array
    largura: number
    altura: number
}

export interface ImagemComNome extends Imagem {
    nome: string
}

export interface cor {
    [key: string] : number
    r: number, g: number, b: number
}
