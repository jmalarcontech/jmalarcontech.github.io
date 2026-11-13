const numeros = [40, 1, 5, 200, -7, 13];

// Sin función de comparación, sort() ordena como texto: [-7, 1, 13, 200, 40, 5]
const ordenados = [...numeros].sort((a, b) => a - b);

console.log("Original:", numeros);
console.log("Ordenado:", ordenados); // [-7, 1, 5, 13, 40, 200]
