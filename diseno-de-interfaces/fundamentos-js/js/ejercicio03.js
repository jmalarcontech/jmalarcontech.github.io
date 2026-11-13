const persona = {
  nombre: "Lucía",                    // string
  edad: 32,                           // number
  casada: false,                      // boolean
  segundoApellido: null,              // null
  apodo: undefined,                   // undefined
  numeroSocio: 9007199254740993n,     // bigint
  idInterno: Symbol("persona"),       // symbol
  aficiones: ["leer", "nadar", "cine"], // array
  direccion: {                        // objeto
    calle: "Calle Mayor 10",
    ciudad: "Granada",
    cp: "18001"
  }
};

console.log(persona);
console.table(persona);

// Tablas más legibles para las partes anidadas
console.table(persona.aficiones);
console.table(persona.direccion);
