const input = document.getElementById("numero");
const boton = document.getElementById("comprobar");
const resultado = document.getElementById("resultado");

boton.addEventListener("click", () => {
  const numero = Number(input.value);

  if (input.value === "" || !Number.isInteger(numero)) {
    resultado.textContent = "Introduce un número entero.";
  } else if (numero % 2 === 0) {
    resultado.textContent = `${numero} es par`;
  } else {
    resultado.textContent = `${numero} es impar`;
  }
});
