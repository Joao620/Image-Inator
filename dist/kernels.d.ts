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
export declare function BFKNNS(this: IKernelFunctionThis, coresImagemMosaico: number[][][], corPixagem: number[][], quantCoresPixagem: number): number;
export {};
//# sourceMappingURL=kernels.d.ts.map