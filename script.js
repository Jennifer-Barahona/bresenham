
/**
Basandose en el algoritmo siguiente, crear una aplicacion en HTML/JS en donde se trace una linea referida por las coordenadas (x0,y0) y (y0,y1) definidas por el usuario desde
cuadros de texto en HTML. Paralelamente debe generarse y presentarse una tabla en donde se presenten paso a paso los valores para cada una de las variables involucradas en el
proceso. El canvas debe mostar en los costados izquierdo e inferior las marcas de escala numérica.

Deben incluirse métodos nuevos ya sea que se requieran o se obtengan ajustando código ya exxistente. Éstos deben documentarse en forma de comentarios tal como se muestra en
el ejemplo de la función bresenham adjunta.

IMPORTANTE: Debe desarrollar el trabajo paso a paso, realizando commits por cada unos cuantos ajustes (explicando clara y brevemente cada uno de ellos). Saltos abruptos en los
cambios invalidarán el trabajo con notas de cero.
*/

function dibujarEscalas(ctx, scale) {

    ctx.strokeStyle = "#e0e0e0";
    ctx.fillStyle = "#888";
    ctx.font = "10px Arial";
    
    //Dibujamos lineas y números 

    for (let i = 0; i < 20; i++) {
        let pos = i * scale + 40;
        // Para el eje X
        ctx.fillText(i, pos, 495);
        ctx.moveTo(pos, 0); ctx.lineTo(pos, 480);
        // Para el eje Y
        ctx.fillText(i, 5, 480 - (i * scale));
        ctx.moveTo(40, 480 - (i * scale)); ctx.lineTo(600, 480 - (i * scale));
    }
    ctx.stroke();
}

if (isNaN(x0) || isNaN(y0) || isNaN(x1) || isNaN(y1)) {
    alert("Por favor, ingresa números válidos en todos los campos.");
    return;
}


function calcularBresenham(x0, y0, x1, y1) {
    let puntos = [];
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let sx = (x0 < x1) ? 1 : -1;
    let sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;

    let x = x0;
    let y = y0;

    while (true) {
        // Guardamos el estado de las variables en cada paso
        puntos.push({ x, y, pk: err });
        if (x === x1 && y === y1) break;
        
        let e2 = 2 * err;
        if (e2 > -dy) { err -= dy; x += sx; }
        if (e2 < dx) { err += dx; y += sy; }
    }
    return puntos;
}

function ejecutar() {
    const canvas = document.getElementById('canvasBresenham');
    const ctx = canvas.getContext('2d');
    const SCALE = 30; // Tamaño de cada celda
    const OFFSET = 40;

    ctx.clearRect(0, 0, canvas.width, canvas.height); //Esto es para limpiar el canvas

    ctx.beginPath();
    dibujarEscalas(ctx, SCALE);

    const x0 = parseInt(document.getElementById('x0').value);
    const y0 = parseInt(document.getElementById('y0').value);
    const x1 = parseInt(document.getElementById('x1').value);
    const y1 = parseInt(document.getElementById('y1').value);

    const pasos = calcularBresenham(x0, y0, x1, y1);

    
    ctx.strokeStyle = "blue";
    ctx.beginPath();

    for (let i = 0; i < pasos.length; i++) {
        let puntoActual = pasos[i];
        
        // Pasar a  pixeles del canvas
        let xCanvas = puntoActual.x * SCALE + OFFSET;
        let yCanvas = 480 - (puntoActual.y * SCALE);

        if (i === 0) {
            ctx.moveTo(xCanvas, yCanvas); // Empezar en el primer punto
        } else {
            ctx.lineTo(xCanvas, yCanvas); // Trazar hacia el siguiente
        }
        
        // Dibujar un puntito rojo en cada coordenada
        ctx.fillStyle = "red";
        ctx.fillRect(xCanvas - 2, yCanvas - 2, 4, 4);
    }
    ctx.stroke();

    // Creamos la tabla
    let contenidoTabla = "<table>";
    contenidoTabla += "<tr><th>Paso</th><th>X</th><th>Y</th><th>Error</th></tr>";

    for (let i = 0; i < pasos.length; i++) {
        let p = pasos[i];
        // Vamos sumando filas a la tabla una por una
        contenidoTabla += "<tr>";
        contenidoTabla += "<td>" + i + "</td>";
        contenidoTabla += "<td>" + p.x + "</td>";
        contenidoTabla += "<td>" + p.y + "</td>";
        contenidoTabla += "<td>" + p.pk + "</td>";
        contenidoTabla += "</tr>";
    }

    contenidoTabla += "</table>";

    // Poner todo el texto de la tabla
    document.getElementById('tablaResultado').innerHTML = contenidoTabla;
}

window.onload = ejecutar;
