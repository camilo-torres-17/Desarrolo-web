function verDetalle(nombre, precio, descripcion, imagen, descuento){

document.getElementById("detalle-producto").innerHTML = `
<div class="modal">
<div class="detalle-card">
<button class="cerrar" onclick="cerrarDetalle()">X</button>
<h2>${nombre}</h2>
<img src="${imagen}" class="detalle-img">
<p><strong>Precio:</strong> $${precio}</p>
<p><strong>Descripción:</strong> ${descripcion}</p>
<p><strong>Descuento:</strong> ${descuento}</p>
</div>
</div>`;

}

function cerrarDetalle(){
document.getElementById("detalle-producto").innerHTML="";
}

function agregarCarrito(nombre, precio, imagen){
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    let producto = {
        nombre: nombre,
        precio: precio,
        imagen: imagen
    };

    carrito.push(producto);

    localStorage.setItem("carrito", JSON.stringify(carrito));

    alert(nombre + " agregado al carrito 🛒");
}

function actualizarContador(){
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    document.getElementById("contador-carrito").innerText = carrito.length;
}

actualizarContador();