function azar(min, max) {
  // Incluye ambos extremos
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

console.log(azar(-5, 10)); // por ejemplo: 3
console.log(azar(1, 6));   // como un dado
