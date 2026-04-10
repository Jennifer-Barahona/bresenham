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

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    dibujarEscalas(ctx, SCALE);

    const x0 = parseInt(document.getElementById('x0').value);
    const y0 = parseInt(document.getElementById('y0').value);
    const x1 = parseInt(document.getElementById('x1').value);
    const y1 = parseInt(document.getElementById('y1').value);

    const historial = calcularBresenham(x0, y0, x1, y1);

    // Dibujar línea y generar tabla simultáneamente
    let tablaHtml = '<table><tr><th>Paso</th><th>X</th><th>Y</th><th>pk</th></tr>';
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.beginPath();

    historial.forEach((p, i) => {
        let drawX = p.x * SCALE + OFFSET;
        let drawY = 480 - (p.y * SCALE);
        
        if (i === 0) ctx.moveTo(drawX, drawY);
        else ctx.lineTo(drawX, drawY);
        
        ctx.fillRect(drawX - 2, drawY - 2, 4, 4); // Punto
        tablaHtml += `<tr><td>${i}</td><td>${p.x}</td><td>${p.y}</td><td>${p.pk}</td></tr>`;
    });
    
    ctx.stroke();
    document.getElementById('tablaResultado').innerHTML = tablaHtml + '</table>';
}

window.onload = ejecutar;
