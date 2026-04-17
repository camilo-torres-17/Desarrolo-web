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
        <div class="admin-card">

            <div class="admin-info">
                <img src="${p.imagen}">
                <div>
                    <p class="admin-nombre">${p.nombre}</p>
                    <p class="admin-precio">$${p.precio}</p>
                    <small>${p.categoria}</small>
                </div>
            </div>

            <div class="admin-botones">
                <button class="btn-editar" onclick="editar(${p.id})">✏️</button>
                <button class="btn-eliminar" onclick="eliminar(${p.id})">❌</button>
            </div>

        </div>
    `;
});
    });
}

// CREAR
function crearProducto(){

    let formData = new FormData();

    formData.append("nombre", document.getElementById("nombre").value);
    formData.append("precio", document.getElementById("precio").value);
    formData.append("categoria", document.getElementById("categoria").value);
    formData.append("descripcion", document.getElementById("descripcion").value);

    let archivo = document.getElementById("imagen").files[0];
    formData.append("imagen", archivo);

    fetch("/api/productos", {
        method: "POST",
        body: formData
    })
    .then(() => {
        alert("Producto creado con imagen 📸");
        cargarAdmin();
    });
}

// ELIMINAR
function eliminar(id){
    fetch(API + "/" + id, { method: "DELETE" })
    .then(() => cargarProductos());
}

// INICIAR
cargarProductos();

function logout(){
    localStorage.removeItem("admin");
    window.location.href = "/";
}

