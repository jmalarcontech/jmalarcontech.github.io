const frase = prompt("Escribe una frase:") || "";

// trim() quita espacios al principio y al final
// split(/\s+/) divide por uno o más espacios seguidos
const palabras = frase.trim() === "" ? [] : frase.trim().split(/\s+/);

console.log(`La frase tiene ${palabras.length} palabras.`);
