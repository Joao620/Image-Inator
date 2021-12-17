const GPU = require('gpu.js')

const data = [
  [ [ 1, 2, 3 ], [ 10, 11, 12 ] ],
  [ [ 20, 22, 22 ], [ 30, 32, 32 ] ]
]

const gpu = new GPU.GPU()

const first = gpu.createKernel(function () {
  return [1, 0];
})
// .setPipeline(true)
  .setOutput([5]);

console.log(first())

console.log(data)

const kernel = gpu.createKernel(function(a){
  let saida = 0;

  let lau =  a[this.thread.x][this.thread.y]

  saida += lau[0]
  saida += lau[1]
  saida += lau[2]

  return saida

}, {
  output: [2, 2],
  argumentTypes: {a: 'Array2D(3)'}
})

const resultado = kernel(data)

console.log(resultado)
