"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPixage = exports.createMosaicImage = void 0;
const gerarPiximagem_1 = __importDefault(require("./criarPixagem/gerarPiximagem"));
const criarMosaicoImagem_1 = __importDefault(require("./criarMosaico/criarMosaicoImagem"));
const createMosaicImage = criarMosaicoImagem_1.default;
exports.createMosaicImage = createMosaicImage;
const createPixage = gerarPiximagem_1.default;
exports.createPixage = createPixage;
//# sourceMappingURL=index.js.map