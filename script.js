let nivelActual = 1;
let preguntaActual;
let respuestaCorrecta;
let historial = [];

// Referencias a elementos del DOM
const nivelSection = document.getElementById('nivel');
const ejercicioSection = document.getElementById('ejercicio');
const preguntaElement = document.getElementById('pregunta');
const respuestaInput = document.getElementById('respuesta');
const resultadoElement = document.getElementById('resultado');
const historialSelect = document.getElementById('historial-select');

// Función para iniciar el nivel seleccionado
function iniciarNivel(nivel) {
    nivelActual = nivel;
    nivelSection.style.display = 'none';
    generarPregunta();
    ejercicioSection.style.display = 'block';
    setTimeout(() => respuestaInput.focus(), 100); // Autoenfoque en el campo de respuesta
}

// Función para generar una nueva pregunta
function generarPregunta() {
    let a, b, c, d, operacion;
    let expresion = '';

    switch(nivelActual) {
        case 1:
            // Nivel 1: Sumas y restas simples como 1 - 4 o -3 + 5
            a = getRandomInt(-10, 10);
            b = getRandomInt(-10, 10);
            operacion = Math.random() > 0.5 ? '+' : '-';
            expresion = `${formatNumber(a)} ${operacion} ${formatNumber(b)}`;
            respuestaCorrecta = calcular(a, b, operacion);
            break;
        case 2:
            // Nivel 2: Sumas y restas complejas, multiplicaciones y divisiones
            const tipoOperacion = Math.random();
            if (tipoOperacion < 0.5) {
                // Sumas y restas complejas como 33 + (-7) + 12 o 3 - 5 + 8 - (-3)
                const numOperaciones = getRandomInt(2, 4);
                expresion = '';
                let resultadoTemp = 0;
                let operadorAnterior = '';
                for (let i = 0; i < numOperaciones; i++) {
                    let num = getRandomInt(-20, 20);
                    let op = Math.random() > 0.5 ? '+' : '-';
                    expresion += `${i === 0 ? '' : ' ' + op + ' '} ${formatNumber(num)}`;
                    if (i === 0) {
                        resultadoTemp = num;
                    } else {
                        resultadoTemp = calcular(resultadoTemp, num, op);
                    }
                }
                respuestaCorrecta = resultadoTemp;
            } else if (tipoOperacion < 0.75) {
                // Multiplicaciones como 2 · (-3)
                a = getRandomInt(-20, 20);
                b = getRandomInt(-10, 10);
                operacion = '·';
                expresion = `${formatNumber(a)} ${operacion} ${formatNumber(b)}`;
                respuestaCorrecta = a * b;
            } else {
                // Divisiones como (-4) ÷ 2, asegurando que b no sea 0 y la división sea exacta
                a = getRandomInt(-20, 20);
                b = getRandomInt(1, 10); // Evitar división por 0
                // Asegurar que a es divisible por b
                a = b * getRandomInt(-10, 10);
                operacion = '÷';
                expresion = `${formatNumber(a)} ${operacion} ${formatNumber(b)}`;
                respuestaCorrecta = a / b;
            }
            break;
        case 3:
            // Nivel 3: Sumas y restas con operaciones dentro de paréntesis como 2 + (3 -5) o 12 - (4 -7)
            a = getRandomInt(-50, 50);
            b = getRandomInt(-20, 20);
            c = getRandomInt(-20, 20);
            operacion = Math.random() > 0.5 ? '+' : '-';
            let operacionInterna = Math.random() > 0.5 ? '+' : '-';
            expresion = `${formatNumber(a)} ${operacion} (${formatNumber(b)} ${operacionInterna} ${formatNumber(c)})`;
            // Calcular la respuesta
            let resultadoInterno = calcular(b, c, operacionInterna);
            respuestaCorrecta = calcular(a, resultadoInterno, operacion);
            break;
        case 4:
            // Nivel 4: Combinación de sumas, restas, multiplicaciones y divisiones
            // Ejemplo: 2 · (5 - 3) + 3 -5 o 3 · 4 - (1 -5)
            const operaciones = ['+', '-', '·', '÷'];
            let numElements = getRandomInt(3, 5);
            expresion = '';
            let resultadoTemp4 = 0;
            let lastOp = '';
            let operadoresUsados = [];

            for (let i = 0; i < numElements; i++) {
                let num = getRandomInt(-20, 20);
                let op = operaciones[getRandomInt(0, operaciones.length -1)];

                // Manejar operaciones con paréntesis aleatorios
                if (Math.random() < 0.3 && i < numElements -1) { // 30% de probabilidad de añadir paréntesis
                    let num2 = getRandomInt(-10, 10);
                    let opInner = operaciones[getRandomInt(0, operaciones.length -1)];
                    expresion += `${i === 0 ? '' : ' ' + op + ' '} (${formatNumber(num2)} ${opInner} ${formatNumber(getRandomInt(-10,10))})`;
                    // Evaluar la expresión usando Function (asegurando seguridad)
                    try {
                        let evalExpr = expresion.replace(/÷/g, '/').replace(/·/g, '*');
                        respuestaCorrecta = Function('"use strict";return (' + evalExpr + ')')();
                    } catch {
                        respuestaCorrecta = 0;
                    }
                } else {
                    expresion += `${i === 0 ? '' : ' ' + op + ' '} ${formatNumber(num)}`;
                }
            }
            // Evaluar la expresión
            try {
                let evalExpr = expresion.replace(/÷/g, '/').replace(/·/g, '*');
                respuestaCorrecta = Function('"use strict";return (' + evalExpr + ')')();
            } catch {
                respuestaCorrecta = 0;
            }
            break;
        default:
            expresion = '0 + 0';
            respuestaCorrecta = 0;
    }

    preguntaActual = `${expresion} = ?`;
    preguntaElement.innerText = preguntaActual;

    // Limpiar respuestas anteriores
    respuestaInput.value = '';
    resultadoElement.innerText = '';
    respuestaInput.focus(); // Autoenfoque en el campo de respuesta
}

// Función para verificar la respuesta del usuario
function verificarRespuesta() {
    let respuestaUsuario = parseFloat(respuestaInput.value);
    if (isNaN(respuestaUsuario)) {
        alert("Por favor, ingresa un número válido.");
        return;
    }

    let mensaje;
    let color;
    if (respuestaUsuario === respuestaCorrecta) {
        mensaje = "¡Correcto!";
        color = "green";
    } else {
        mensaje = `Incorrecto. La respuesta correcta es ${respuestaCorrecta}.`;
        color = "red";
    }

    resultadoElement.innerText = mensaje;
    resultadoElement.style.color = color;

    // Añadir a historial
    historial.push(`${preguntaActual.replace('= ?', '= ' + respuestaUsuario)} (${mensaje})`);
    actualizarHistorial();

    // Generar una nueva pregunta después de 2 segundos
    setTimeout(generarPregunta, 2000);
}

// Función para actualizar el historial de operaciones
function actualizarHistorial() {
    // Limitar el historial a las últimas 10 operaciones
    if (historial.length > 10) {
        historial.shift();
    }

    // Limpiar el select
    historialSelect.innerHTML = '';

    // Añadir las operaciones al select
    historial.slice().reverse().forEach(op => {
        let option = document.createElement('option');
        option.text = op;
        historialSelect.add(option);
    });
}

// Función para formatear los números negativos con paréntesis
function formatNumber(num) {
    return num < 0 ? `(${num})` : num;
}

// Función para calcular el resultado de una operación
function calcular(a, b, op) {
    switch(op) {
        case '+':
            return a + b;
        case '-':
            return a - b;
        case '·':
            return a * b;
        case '×':
            return a * b;
        case '÷':
            return a / b;
        default:
            return 0;
    }
}

// Función para obtener un número entero aleatorio entre min y max (inclusive)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Función para volver al inicio
function volverInicio() {
    window.location.href = "index.html";
}

// Función para volver a elegir el nivel
function volverNivel() {
    nivelSection.style.display = 'block';
    ejercicioSection.style.display = 'none';
}

// Autoenfoque en la caja de respuesta cuando la página se carga
document.addEventListener("DOMContentLoaded", function() {
    console.log("Página Matemáticas ESO cargada correctamente.");
});
