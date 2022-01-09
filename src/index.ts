import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import criarPixagem from './criarPixagem'
import criarMosaico from './criarMosaico'

//TODO: conseguir pasar os parametros de proporcao de image e quantidade de reducao tambem
yargs(hideBin(process.argv))
.command(['piximage <imagesDir>  [output]', 'pix'], 'Create the piximage config', (yargs) => {
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
}, argv => criarPixagem(argv.imagesDir as string, argv.output as string))
.command(['image <image> <pixageDir> <proportion>', 'im'], 'generate the photo mosaic', (yargs) => {
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

    yargs.positional('proportion', {
        describe: 'the proporcion between the pixage size in the final image, will influence the final image size',
        number: true
    })

    yargs.option('cpu', {
        default: false,
        type: 'boolean',
        describe: 'it uses cpu mode instead of running in gpu, only use if the image came with artifacts'
    })

}, argv => {
    const { image, pixageDir, proportion, cpu } = argv as any
    criarMosaico(image, pixageDir, cpu, proportion)
})
.demandCommand()
.epilog('for more information about the usage of the commands, use "[command-name] help"')
.parse()
