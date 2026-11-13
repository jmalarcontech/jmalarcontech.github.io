function esPrimo(num) {
  if (num < 2) return false;

  // Basta con comprobar divisores hasta la raíz cuadrada
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

const limite = Number(prompt("Introduce un número entero:"));
const primos = [];

for (let i = 1; i <= limite; i++) {
  if (esPrimo(i)) primos.push(i);
}

console.log(`Primos entre 1 y ${limite}:`, primos.join(", "));
// Con 30: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29
