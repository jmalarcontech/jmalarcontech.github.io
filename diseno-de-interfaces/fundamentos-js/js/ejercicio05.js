const numero = Number(prompt("Introduce un número entero:"));

if (!Number.isInteger(numero)) {
  console.log("Debes introducir un número entero.");
} else if (numero % 2 === 0) {
  console.log(`${numero} es par`);
} else {
  console.log(`${numero} es impar`);
}
