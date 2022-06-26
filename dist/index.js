"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPixage = exports.imageMosaicFactory = void 0;
const gerarPiximagem_1 = __importDefault(require("./criarPixagem/gerarPiximagem"));
exports.createPixage = gerarPiximagem_1.default;
const criarMosaicoImagem_1 = __importDefault(require("./criarMosaico/criarMosaicoImagem"));
exports.imageMosaicFactory = criarMosaicoImagem_1.default;
//# sourceMappingURL=index.js.map