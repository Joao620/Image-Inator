import { IKernelFunctionThis } from 'gpu.js';
interface calcularMediaCoresThis extends IKernelFunctionThis {
    constants: {
        altura: number;
        largura: number;
        divisoesAltura: number;
        divisoesLargura: number;
    };
}
export declare function calcularMediaCores(this: calcularMediaCoresThis, imagem: number[][][]): number[];
interface BFKNNSThis extends IKernelFunctionThis {
    constants: {
        quantCoresPixagem: number;
    };
}
export declare function BFKNNS(this: BFKNNSThis, coresImagemMosaico: number[][][], corPixagem: number[][]): number;
export {};
