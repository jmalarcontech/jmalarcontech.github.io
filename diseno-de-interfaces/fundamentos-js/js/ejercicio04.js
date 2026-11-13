const num1 = Number(prompt("Introduce el primer número:"));
const num2 = Number(prompt("Introduce el segundo número:"));

if (isNaN(num1) || isNaN(num2)) {
  console.log("Alguno de los valores no es un número válido.");
} else {
  const suma = num1 + num2;
  console.log(`La suma de ${num1} y ${num2} es ${suma}`);
}
