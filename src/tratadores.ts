export function pegarImagemDoInput(): File{
    const elementoInput = document.querySelector(".imagem-input")
    if (!(elementoInput! instanceof HTMLInputElement)){
        throw new Error("O elemento selecionado não é um input")
    }

    if(elementoInput.files === null){
        throw new Error("Nenhum arquivo foi passado")
    }

    if(elementoInput.files.length <= 0){
        throw new Error("Nenhum arquivo foi passado")
    }

    if(elementoInput.files.length > 1){
        throw new Error("Mais de um arquivo foi passado")
    }

    let imagem = elementoInput.files[0]

    return imagem
}

