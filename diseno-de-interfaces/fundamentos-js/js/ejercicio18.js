function palabraMasLarga(frase) {
  const palabras = frase.trim().split(/\s+/);
  let masLarga = "";

  for (const palabra of palabras) {
    if (palabra.length > masLarga.length) {
      masLarga = palabra;
    }
  }

  return masLarga;
}

const frase = prompt("Escribe una frase:") || "";
console.log("La palabra más larga es:", palabraMasLarga(frase));
// "El murciélago vuela de noche" -> "murciélago"
