let nivelActual = 1;
let preguntaActual;
let respuestaCorrecta;

function iniciarNivel(nivel) {
    nivelActual = nivel;
    document.getElementById('nivel').style.display = 'none';
    generarPregunta();
    document.getElementById('ejercicio').style.display = 'block';
}

function generarPregunta() {
    let a, b, operacion;
    switch(nivelActual) {
        case 1:
            // Nivel básico: solo suma y resta con números pequeños
            a = getRandomInt(-10, 10);
            b = getRandomInt(-10, 10);
            operacion = Math.random() > 0.5 ? '+' : '-';
            break;
        case 2:
            // Nivel intermedio: incluye multiplicación
            a = getRandomInt(-20, 20);
            b = getRandomInt(-20, 20);
            operacion = Math.random() > 0.66 ? '+' : (Math.random() > 0.5 ? '-' : '×');
            break;
        case 3:
            // Nivel avanzado: incluye división (sin decimales)
            a = getRandomInt(-50, 50);
            b = getRandomInt(-10, 10);
            operacion = Math.random() > 0.75 ? '+' : (Math.random() > 0.6 ? '-' : (Math.random() > 0.5 ? '×' : '÷'));
            if (operacion === '÷') {
                // Asegurar que la división sea exacta y b no sea cero
                b = b === 0 ? 1 : b;
                a = a * b;
            }
            break;
        default:
            a = 0;
            b = 0;
            operacion = '+';
    }

    preguntaActual = `${a} ${operacion} ${b} = ?`;
    document.getElementById('pregunta').innerText = preguntaActual;

    // Calcular respuesta correcta
    switch(operacion) {
        case '+':
            respuestaCorrecta = a + b;
            break;
        case '-':
            respuestaCorrecta = a - b;
            break;
        case '×':
            respuestaCorrecta = a * b;
            break;
        case '÷':
            respuestaCorrecta = a / b;
            break;
    }

    // Limpiar respuestas anteriores
    document.getElementById('respuesta').value = '';
    document.getElementById('resultado').innerText = '';
}

function verificarRespuesta() {
    let respuestaUsuario = parseFloat(document.getElementById('respuesta').value);
    if (isNaN(respuestaUsuario)) {
        alert("Por favor, ingresa un número válido.");
        return;
    }

    if (respuestaUsuario === respuestaCorrecta) {
        document.getElementById('resultado').innerText = "¡Correcto!";
        document.getElementById('resultado').style.color = "green";
    } else {
        document.getElementById('resultado').innerText = `Incorrecto. La respuesta correcta es ${respuestaCorrecta}.`;
        document.getElementById('resultado').style.color = "red";
    }

    // Generar una nueva pregunta después de 2 segundos
    setTimeout(generarPregunta, 2000);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.addEventListener("DOMContentLoaded", function() {
    console.log("Página Matemáticas ESO cargada correctamente.");
});
