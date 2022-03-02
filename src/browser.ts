import lau from './criarMosaico/comparacaoPiximagem'
import dale from './criarPixagem/createImageBlock'

interface WindowPlus extends Window{
  mosaicInator: any
}

declare let window: WindowPlus

window.mosaicInator = {
  lau,
  dale
}
