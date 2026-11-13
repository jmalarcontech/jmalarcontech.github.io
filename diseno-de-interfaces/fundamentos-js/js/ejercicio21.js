function mayoresQue(array, valor) {
  return array.filter(n => n > valor);
}

console.log(mayoresQue([3, 15, 8, 22, 1, 10], 9)); // [15, 22, 10]
