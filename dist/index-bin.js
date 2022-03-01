"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const criarPixagem_1 = __importDefault(require("./criarPixagem"));
const criarMosaico_1 = __importDefault(require("./criarMosaico"));
(0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
    .command(['piximage <imagesDir>  [output]', 'pix'], 'Create the piximage config', (yargs) => {
    yargs.positional('imagesDir', {
        describe: 'path to dir that contains the images',
        string: true,
        normalize: true,
    });
    yargs.positional('output', {
        describe: 'path that the pixage will be',
        string: true,
        normalize: true,
        default: './'
    });
    yargs.example('pix foo/ bar/', 'will use the images in ./foo to generate the pixage and store it in ./bar');
}, argv => (0, criarPixagem_1.default)(argv.imagesDir, argv.output))
    .command(['image <image> <pixageDir> <proportion>', 'im'], 'generate the photo mosaic', (yargs) => {
    yargs.positional('image', {
        describe: 'the image that will be transformed in to a photo mosaic',
        string: true,
        normalize: true,
    });
    yargs.positional('pixageDir', {
        describe: 'the directory that contains the pixage image and attrs.json',
        string: true,
        normalize: true,
    });
    yargs.positional('proportion', {
        describe: 'the proporcion between the pixage size in the final image, will influence the final image size',
        number: true
    });
    yargs.option('cpu', {
        default: false,
        type: 'boolean',
        describe: 'it uses cpu mode instead of running in gpu, only use if the image came with artifacts'
    });
}, argv => {
    const { image, pixageDir, proportion, cpu } = argv;
    (0, criarMosaico_1.default)(image, pixageDir, cpu, proportion);
})
    .demandCommand()
    .epilog('for more information about the usage of the commands, use "[command-name] help"')
    .parse();
