const nombre = "Ana";            // string
const edad = 28;                 // number
const esEstudiante = true;       // boolean
let sinValor;                    // undefined
const vacio = null;              // null (typeof devuelve "object")
const grande = 12345678901234567890n; // bigint
const id = Symbol("id");         // symbol
const colores = ["rojo", "verde"]; // object (array)
const coche = { marca: "Seat", modelo: "Ibiza" }; // object

console.log("nombre:", nombre, "| tipo:", typeof nombre);
console.info("edad:", edad, "| tipo:", typeof edad);
console.debug("esEstudiante:", esEstudiante, "| tipo:", typeof esEstudiante);
console.error("sinValor:", sinValor, "| tipo:", typeof sinValor);
console.log("vacio:", vacio, "| tipo:", typeof vacio);
console.info("grande:", grande, "| tipo:", typeof grande);
console.debug("id:", id.toString(), "| tipo:", typeof id);
console.log("colores:", colores, "| tipo:", typeof colores, "| ¿es array?", Array.isArray(colores));
console.info("coche:", coche, "| tipo:", typeof coche);
