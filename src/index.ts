import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import whel from './gerarPiximagem'
import criarMosaicoImagem from './criarMosaicoImagem'

//TODO: conseguir pasar os parametros de proporcao de image e quantidade de reducao tambem
yargs(hideBin(process.argv))
.command(['piximage <imagesDir> [output]', 'pix'], 'Create the piximage config', (yargs) => {
    yargs.positional('imagesDir', {
        describe: 'path to dir that contains the images',
        string: true,
        normalize: true,
    })

    yargs.positional('output', {
        describe: 'path that the pixage will be',
        string: true,
        normalize: true,
        default: './'
    })

    yargs.example('pix foo/ bar/', 'will use the images in ./foo to generate the pixage and store it in ./bar')
}, argv => whel(argv.imagesDir as string, argv.output as string))
.command(['image <image> <pixageDir>', 'im'], 'generate the photo mosaic', (yargs) => {
    yargs.positional('image', {
        describe: 'the image that will be transformed in to a photo mosaic',
        string: true,
        normalize: true,
    })

    yargs.positional('pixageDir', {
        describe: 'the directory that contains the pixage image and attrs.json',
        string: true,
        normalize: true,
    })
}, argv => criarMosaicoImagem(argv.pixageDir as string, argv.image as string))
.demandCommand()
.epilog('for more information about the usage of the commands, use "[command-name] help"')
.parse()
