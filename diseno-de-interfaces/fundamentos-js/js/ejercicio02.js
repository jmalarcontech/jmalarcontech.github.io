const numeros = [];

for (let i = 0; i < 100; i++) {
  numeros.push(Math.floor(Math.random() * 100) + 1); // valores del 1 al 100
}

console.table(numeros);

// Filtrado: valores entre 20 y 50 (ambos incluidos)
const min = 20;
const max = 50;
const enRango = numeros.filter(n => n >= min && n <= max);

console.log(`Valores entre ${min} y ${max}:`);
console.table(enRango);
