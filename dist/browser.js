"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const comparacaoPiximagem_1 = __importDefault(require("./criarMosaico/comparacaoPiximagem"));
const createImageBlock_1 = __importDefault(require("./criarPixagem/createImageBlock"));
window.mosaicInator = {
    lau: comparacaoPiximagem_1.default,
    dale: createImageBlock_1.default
};
