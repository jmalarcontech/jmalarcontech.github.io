function promedio(array) {
  if (array.length === 0) return 0;

  const suma = array.reduce((acumulado, actual) => acumulado + actual, 0);
  return suma / array.length;
}

console.log(promedio([4, 8, 6, 2])); // 5
console.log(promedio([7.5, 9, 6]));  // 7.5
