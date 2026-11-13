function esPalindromo(palabra) {
  const limpia = palabra.toLowerCase();
  const invertida = limpia.split("").reverse().join("");
  return limpia === invertida;
}

console.log(esPalindromo("Reconocer")); // true
console.log(esPalindromo("Radar"));     // true
console.log(esPalindromo("Granada"));   // false
