function filtrarPares(array) {
  return array.filter(n => n % 2 === 0);
}

console.log(filtrarPares([1, 2, 3, 4, 5, 6, 7, 8])); // [2, 4, 6, 8]
