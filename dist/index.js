"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPixage = exports.createMosaicImage = void 0;
var gerarPiximagem_1 = __importDefault(require("./criarPixagem/gerarPiximagem"));
var criarMosaicoImagem_1 = __importDefault(require("./criarMosaico/criarMosaicoImagem"));
var createMosaicImage = criarMosaicoImagem_1.default;
exports.createMosaicImage = createMosaicImage;
var createPixage = gerarPiximagem_1.default;
exports.createPixage = createPixage;
//# sourceMappingURL=index.js.map