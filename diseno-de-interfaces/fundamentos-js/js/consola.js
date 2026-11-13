/*
 * consola.js · Jesús Alarcón
 *
 * Copia en la propia página lo que el ejercicio escribe en la consola
 * (console.log, info, warn, error, debug, table...) y los errores, para
 * que no haga falta abrir F12. El código de los ejercicios no cambia y la
 * consola del navegador sigue recibiendo exactamente lo mismo.
 *
 * Uso: se carga en el <head>, ANTES del script del ejercicio y sin defer.
 *   <script src="js/consola.js"></script>
 *   <script src="js/ejercicio01.js" defer></script>
 *
 * La salida se escribe dentro del elemento con id="consola". Si la página
 * no lo tiene, se crea un recuadro nuevo al final de <main>.
 */
(function () {
  "use strict";

  if (window.__consolaPagina) return; // por si se carga dos veces
  window.__consolaPagina = true;

  const ETIQUETAS = { info: "info", warn: "aviso", error: "error", debug: "debug" };
  const MAX_ELEMENTOS = 100;  // elementos de un array u objeto que se muestran
  const MAX_FILAS = 500;      // filas de console.table que se muestran

  const pendientes = [];      // líneas que llegan antes de que exista el recuadro
  let lineas = null;          // contenedor de las líneas en la página
  let avisoVacio = null;      // texto "sin salida", se quita con la primera línea

  /* ---------- 1. Pasar valores a texto, como hace la consola ---------- */

  // nivel 0 = argumento directo de console.log: los textos van sin comillas.
  function aTexto(valor, nivel, vistos) {
    if (typeof valor === "string") return nivel === 0 ? valor : "'" + valor + "'";
    if (typeof valor === "number") return Object.is(valor, -0) ? "-0" : String(valor);
    if (typeof valor === "bigint") return valor + "n";
    if (typeof valor === "symbol") return valor.toString();
    if (typeof valor === "function") return "ƒ " + (valor.name || "anónima") + "()";
    if (valor === null || typeof valor !== "object") return String(valor); // boolean, undefined

    if (vistos.includes(valor)) return "[Circular]";
    if (valor instanceof Error) return valor.name + ": " + valor.message;
    if (valor instanceof Date) return valor.toString();
    if (valor instanceof RegExp) return String(valor);
    if (typeof Element !== "undefined" && valor instanceof Element) {
      return "<" + valor.tagName.toLowerCase() + (valor.id ? "#" + valor.id : "") + ">";
    }
    if (nivel > 2) return Array.isArray(valor) ? "[…]" : "{…}";

    const dentro = vistos.concat([valor]);
    const hijo = (v) => aTexto(v, nivel + 1, dentro);

    if (Array.isArray(valor)) {
      const partes = valor.slice(0, MAX_ELEMENTOS).map(hijo);
      if (valor.length > MAX_ELEMENTOS) partes.push("… " + (valor.length - MAX_ELEMENTOS) + " más");
      return "[" + partes.join(", ") + "]";
    }
    if (valor instanceof Map) {
      const partes = Array.from(valor, ([k, v]) => hijo(k) + " => " + hijo(v));
      return "Map(" + valor.size + ") {" + partes.join(", ") + "}";
    }
    if (valor instanceof Set) {
      return "Set(" + valor.size + ") {" + Array.from(valor, hijo).join(", ") + "}";
    }

    const claves = Object.keys(valor);
    const partes = claves.slice(0, MAX_ELEMENTOS).map((k) => nombreClave(k) + ": " + hijo(valor[k]));
    if (claves.length > MAX_ELEMENTOS) partes.push("…");
    const clase = valor.constructor && valor.constructor !== Object && valor.constructor.name;
    return (clase ? clase + " " : "") + "{" + partes.join(", ") + "}";
  }

  function nombreClave(clave) {
    return /^(\d+|[\p{L}_$][\p{L}\p{N}_$]*)$/u.test(clave) ? clave : "'" + clave + "'";
  }

  function textoSeguro(valor, nivel) {
    try {
      return aTexto(valor, nivel, []);
    } catch (e) {
      return Object.prototype.toString.call(valor);
    }
  }

  // Une los argumentos de console.log y entiende %s, %d, %i, %f, %o, %O y %c.
  function unirArgumentos(args) {
    let resto = Array.from(args);
    let inicio = "";

    if (typeof resto[0] === "string" && /%[sdifoOc]/.test(resto[0])) {
      const formato = resto.shift();
      inicio = formato.replace(/%([sdifoOc%])/g, (marca, tipo) => {
        if (tipo === "%") return "%";
        if (resto.length === 0) return marca;
        const v = resto.shift();
        if (tipo === "c") return ""; // los estilos CSS no se copian
        if (tipo === "d" || tipo === "i") return String(parseInt(v, 10));
        if (tipo === "f") return String(parseFloat(v));
        if (tipo === "s" && typeof v === "string") return v;
        return textoSeguro(v, 1);
      });
      if (resto.length === 0) return inicio;
      inicio += " ";
    }
    return inicio + resto.map((v) => textoSeguro(v, 0)).join(" ");
  }

  /* ---------- 2. console.table como una tabla de verdad ---------- */

  function crearTabla(datos, columnasPedidas) {
    const filas = Array.isArray(datos)
      ? datos.map((v, i) => [String(i), v])
      : Object.keys(datos).map((k) => [k, datos[k]]);

    let columnas = [];
    let hayValores = false;
    filas.forEach(([, v]) => {
      if (v !== null && typeof v === "object") {
        Object.keys(v).forEach((k) => { if (!columnas.includes(k)) columnas.push(k); });
      } else {
        hayValores = true;
      }
    });
    if (Array.isArray(columnasPedidas)) {
      columnas = columnasPedidas.map(String);
      hayValores = false;
    }

    const tabla = document.createElement("table");
    tabla.className = "consola-tabla";

    const cabecera = tabla.createTHead().insertRow();
    ["(índice)"].concat(columnas, hayValores ? ["Valor"] : []).forEach((titulo) => {
      const th = document.createElement("th");
      th.textContent = titulo;
      cabecera.appendChild(th);
    });

    const cuerpo = tabla.createTBody();
    filas.slice(0, MAX_FILAS).forEach(([indice, v]) => {
      const fila = cuerpo.insertRow();
      fila.insertCell().textContent = indice;
      const esObjeto = v !== null && typeof v === "object";
      columnas.forEach((col) => {
        fila.insertCell().textContent = esObjeto && col in v ? textoSeguro(v[col], 1) : "";
      });
      if (hayValores) fila.insertCell().textContent = esObjeto ? "" : textoSeguro(v, 1);
    });

    const caja = document.createElement("div");
    caja.className = "consola-tabla-caja";
    caja.appendChild(tabla);
    if (filas.length > MAX_FILAS) {
      const mas = document.createElement("div");
      mas.textContent = "… " + (filas.length - MAX_FILAS) + " filas más (F12 para verlas todas)";
      caja.appendChild(mas);
    }
    return caja;
  }

  /* ---------- 3. Escribir líneas en la página ---------- */

  function nuevaLinea(tipo, contenido) {
    const linea = document.createElement("div");
    linea.className = "consola-linea consola-" + tipo;

    if (ETIQUETAS[tipo]) {
      const etiqueta = document.createElement("span");
      etiqueta.className = "consola-etiqueta";
      etiqueta.textContent = ETIQUETAS[tipo];
      linea.appendChild(etiqueta);
    }

    if (typeof contenido === "string") {
      const texto = document.createElement("span");
      texto.className = "consola-texto";
      texto.textContent = contenido;
      linea.appendChild(texto);
    } else {
      linea.appendChild(contenido);
    }
    return linea;
  }

  function escribir(tipo, contenido) {
    const linea = nuevaLinea(tipo, contenido);
    if (!lineas) {
      pendientes.push(linea);
      return;
    }
    if (avisoVacio) {
      avisoVacio.remove();
      avisoVacio = null;
    }
    lineas.appendChild(linea);
    lineas.scrollTop = lineas.scrollHeight;
  }

  /* ---------- 4. Interceptar la consola (sin quitarle nada) ---------- */

  function interceptar(metodo, alLlamar) {
    const original = console[metodo];
    console[metodo] = function () {
      try {
        alLlamar(arguments);
      } catch (e) {
        // si algo falla al copiar, el ejercicio sigue funcionando igual
      }
      if (typeof original === "function") {
        try {
          return original.apply(console, arguments);
        } catch (e) {
          // otra herramienta que también intercepte la consola no debe romper el ejercicio
        }
      }
    };
  }

  ["log", "info", "warn", "error", "debug"].forEach((metodo) => {
    interceptar(metodo, (args) => escribir(metodo, unirArgumentos(args)));
  });

  interceptar("dir", (args) => escribir("log", textoSeguro(args[0], 1)));

  interceptar("table", (args) => {
    const datos = args[0];
    if (datos !== null && typeof datos === "object") {
      escribir("table", crearTabla(datos, args[1]));
    } else {
      escribir("log", unirArgumentos(args));
    }
  });

  interceptar("assert", (args) => {
    if (!args[0]) {
      const resto = Array.prototype.slice.call(args, 1);
      escribir("error", "Assertion failed" + (resto.length ? ": " + unirArgumentos(resto) : ""));
    }
  });

  interceptar("clear", () => {
    pendientes.length = 0;
    if (lineas) lineas.textContent = "";
  });

  // Errores que nadie captura (por ejemplo, una variable mal escrita)
  window.addEventListener("error", (e) => {
    const archivo = e.filename ? e.filename.split("/").pop() : "";
    const donde = e.lineno ? " (" + (archivo ? archivo + ", " : "") + "línea " + e.lineno + ")" : "";
    escribir("error", "Error no capturado: " + e.message + donde);
  });
  window.addEventListener("unhandledrejection", (e) => {
    escribir("error", "Promesa rechazada sin catch: " + textoSeguro(e.reason, 0));
  });

  /* ---------- 5. prompt() dentro de una página incrustada ---------- */

  // Dentro de Google Sites (y de cualquier iframe sin "allow-modals") el
  // navegador ignora prompt() y devuelve null al instante. Si pasa eso,
  // se avisa en la consola de la página con un enlace para abrirla aparte.
  const promptOriginal = window.prompt;
  let avisoPromptDado = false;

  window.prompt = function () {
    const inicio = Date.now();
    const respuesta = promptOriginal.apply(window, arguments);
    const bloqueado = respuesta === null && Date.now() - inicio < 50 && window.self !== window.top;
    if (bloqueado && !avisoPromptDado) {
      avisoPromptDado = true;
      escribir("warn", avisoPromptBloqueado());
    }
    return respuesta;
  };

  function avisoPromptBloqueado() {
    const caja = document.createElement("span");
    caja.className = "consola-texto";
    caja.append(
      "El navegador no deja usar prompt() en una página incrustada en otra " +
      "(Google Sites, el visor...), así que el ejercicio ha recibido null. "
    );
    const enlace = document.createElement("a");
    enlace.href = window.__paginaReal || location.href;
    enlace.target = "_blank";
    enlace.rel = "noopener";
    enlace.textContent = "Abrir el ejercicio en una pestaña nueva";
    caja.append(enlace);
    return caja;
  }

  /* ---------- 6. Crear el recuadro cuando la página está lista ---------- */

  function prepararRecuadro() {
    let recuadro = document.getElementById("consola");
    if (!recuadro) {
      recuadro = document.createElement("section");
      recuadro.id = "consola";
      recuadro.className = "resultado";
      (document.querySelector("main") || document.body).appendChild(recuadro);
    }

    const cabecera = document.createElement("div");
    cabecera.className = "consola-cabecera";
    const titulo = document.createElement("strong");
    titulo.textContent = "Consola";
    const boton = document.createElement("button");
    boton.type = "button";
    boton.textContent = "↻ Volver a ejecutar";
    boton.title = "Recarga la página y vuelve a ejecutar el ejercicio";
    boton.addEventListener("click", () => location.reload());
    cabecera.append(titulo, boton);

    lineas = document.createElement("div");
    lineas.className = "consola-lineas";
    lineas.setAttribute("role", "log");

    recuadro.insertBefore(lineas, recuadro.firstChild);
    recuadro.insertBefore(cabecera, lineas);

    pendientes.forEach((linea) => lineas.appendChild(linea));
    pendientes.length = 0;

    if (!lineas.children.length) {
      avisoVacio = nuevaLinea("vacia", "Todavía no ha salido nada por la consola.");
      lineas.appendChild(avisoVacio);
    }
  }

  // Los scripts con defer se ejecutan antes de DOMContentLoaded, así que
  // cuando se crea el recuadro ya está toda la salida inicial del ejercicio.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", prepararRecuadro);
  } else {
    prepararRecuadro();
  }
})();
