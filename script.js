
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


function calcularBresenham(x0, y0, x1, y1) {
    
    let puntos = [];
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let sx = (x0 < x1) ? 1 : -1;
    let sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;

    let x = x0;
    let y = y0;

    if (isNaN(x0) || isNaN(y0) || isNaN(x1) || isNaN(y1)) {
        alert("¡Cuidado! Debes completar todos los cuadros con números antes de dibujar.");
        return; // Detiene la función aquí para que no de error más abajo
    }

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

function dibujarEscalasDinamicas(ctx, scale, max, w, h) {
    const OFFSET = 40;
    const baseEjeY = h - OFFSET;

    ctx.strokeStyle = "#e0e0e0";
    ctx.fillStyle = "#888";
    ctx.font = "10px Arial";
    ctx.beginPath();

    for (let i = 0; i <= max; i++) {
        let pos = i * scale + OFFSET;
        
        // Eje X
        ctx.fillText(i, pos - 5, h - 5);
        ctx.moveTo(pos, 0); ctx.lineTo(pos, baseEjeY);
        
        // Eje Y
        ctx.fillText(i, 5, baseEjeY - (i * scale) + 5);
        ctx.moveTo(OFFSET, baseEjeY - (i * scale)); ctx.lineTo(w, baseEjeY - (i * scale));
    }
    ctx.stroke();

    // Ejes principales negros
    ctx.beginPath();
    ctx.strokeStyle = "#000";
    ctx.moveTo(OFFSET, 0); ctx.lineTo(OFFSET, baseEjeY); // Vertical
    ctx.lineTo(w, baseEjeY); // Horizontal
    ctx.stroke();
}

function ejecutar() {
    const canvas = document.getElementById('canvasBresenham');
    const ctx = canvas.getContext('2d');
    const OFFSET = 40;

    
    const x0 = parseInt(document.getElementById('x0').value);
    const y0 = parseInt(document.getElementById('y0').value);
    const x1 = parseInt(document.getElementById('x1').value);
    const y1 = parseInt(document.getElementById('y1').value);

    
    const maxCoord = Math.max(x0, x1, y0, y1, 10);
    let scaleActual = 30; 
    if (maxCoord > 20) scaleActual = 20;
    if (maxCoord > 50) scaleActual = 10;
    if (maxCoord > 100) scaleActual = 5;

    //ajustar tamaño del lienzo antes de dibujar
    canvas.width = (maxCoord * scaleActual) + OFFSET + 20;
    canvas.height = (maxCoord * scaleActual) + OFFSET + 20;
    const altoCanvasInterno = canvas.height - OFFSET;

   
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dibujarEscalasDinamicas(ctx, scaleActual, maxCoord, canvas.width, canvas.height);

   
    const pasos = calcularBresenham(x0, y0, x1, y1);

    //Se dibuja la linea
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let i = 0; i < pasos.length; i++) {
        let p = pasos[i];
        
        
        let xCanvas = p.x * scaleActual + OFFSET;
        let yCanvas = altoCanvasInterno - (p.y * scaleActual);

        if (i === 0) {
            ctx.moveTo(xCanvas, yCanvas);
        } else {
            ctx.lineTo(xCanvas, yCanvas);
        }
        
        ctx.fillStyle = "red";
        ctx.fillRect(xCanvas - 2, yCanvas - 2, 4, 4);
    }
    ctx.stroke();

    //Esto es para generar la tabla
    
    let contenidoTabla = "<table><tr><th>Paso</th><th>X</th><th>Y</th><th>Error</th></tr>";
    for (let i = 0; i < pasos.length; i++) {
        let p = pasos[i];
        contenidoTabla += `<tr><td>${i}</td><td>${p.x}</td><td>${p.y}</td><td>${p.pk}</td></tr>`;
    }
    document.getElementById('tablaResultado').innerHTML = contenidoTabla + "</table>";
}

window.onload = ejecutar;
