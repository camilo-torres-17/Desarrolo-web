const API = "/api/productos";

// MOSTRAR
function cargarProductos(){
    fetch(API)
    .then(res => res.json())
    .then(data => {
        let contenedor = document.getElementById("lista");
        contenedor.innerHTML = "";

        data.forEach(p => {
            contenedor.innerHTML += `
                <div>
                    <p>${p.nombre} - $${p.precio}</p>
                    <button onclick="eliminar(${p.id})">Eliminar</button>
                </div>
            `;
        });
    });
}

// CREAR
function crearProducto(){
    let producto = {
        nombre: document.getElementById("nombre").value,
        precio: document.getElementById("precio").value,
        imagen: document.getElementById("imagen").value
    };

    fetch(API, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(producto)
    }).then(() => cargarProductos());
}

// ELIMINAR
function eliminar(id){
    fetch(API + "/" + id, { method: "DELETE" })
    .then(() => cargarProductos());
}

// INICIAR
cargarProductos();