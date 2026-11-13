const numeros = [];

for (let i = 0; i < 100; i++) {
  numeros.push(Math.floor(Math.random() * 20) + 1);
}

// Frecuencia de cada número
const frecuencias = {};
for (const n of numeros) {
  frecuencias[n] = (frecuencias[n] || 0) + 1;
}

console.log("Veces que aparece cada número:");
console.table(frecuencias);

// Cuántos números distintos han aparecido al menos una vez
const distintos = Object.keys(frecuencias).length;
console.log(`Han aparecido ${distintos} números distintos de los 20 posibles.`);

// Si alguno no ha salido, lo mostramos
const noAparecen = [];
for (let n = 1; n <= 20; n++) {
  if (!frecuencias[n]) noAparecen.push(n);
}
console.log("No han aparecido:", noAparecen.length ? noAparecen : "ninguno");
