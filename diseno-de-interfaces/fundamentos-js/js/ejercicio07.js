function contarVocales(palabra) {
  const vocales = "aeiouáéíóúü";
  let contador = 0;

  for (let i = 0; i < palabra.length; i++) {
    const letra = palabra[i].toLowerCase();
    if (vocales.includes(letra)) {
      contador++;
    }
  }

  return contador;
}

console.log(contarVocales("Murciélago")); // 5
console.log(contarVocales("JavaScript")); // 3
