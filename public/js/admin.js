let productoEditando = null;
const API = "/api/productos";

// =======================
// MOSTRAR PRODUCTOS
// =======================
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

    <button class="btn-editar" onclick="editarProducto(${p.id})">
        ✏️
    </button>

    <button class="btn-eliminar" onclick="eliminar(${p.id})">
        ❌
    </button>

</div>

                </div>
            `;
        });
    });
}

// =======================
// CREAR PRODUCTO
// =======================
function crearProducto(){

    let btn = document.querySelector(".btn-guardar");
    btn.disabled = true;

    let formData = new FormData();

    formData.append("nombre", document.getElementById("nombre").value);
    formData.append("precio", document.getElementById("precio").value);
    formData.append("categoria", document.getElementById("categoria").value);
    formData.append("descripcion", document.getElementById("descripcion").value);

    let imagenInput = document.getElementById("imagen");
    let imagen = imagenInput.files[0];

    if(imagen){
        formData.append("imagen", imagen);
    }

    let url = API;
let metodo = "POST";

if(productoEditando){

    url = API + "/" + productoEditando;
    metodo = "PUT";

}

fetch(url,{
    method: metodo,
    body: formData,
    credentials: 'include'
})
    .then(res => res.json())
    .then(()=>{
        alert("Producto creado");
        cargarProductos();

        limpiarFormulario();

        productoEditando = null;

        btn.disabled = false;
    })
    .catch(()=>{
        btn.disabled = false;
    });
}

// =======================
// ELIMINAR
// =======================
function eliminar(id){
    fetch(API + "/" + id, { 
        method: "DELETE",
        credentials: 'include'
    })
    .then(() => cargarProductos());
}

async function editarProducto(id){

    const res = await fetch(API);

    const productos = await res.json();

    const producto = productos.find(p => p.id == id);

    productoEditando = id;

    document.getElementById("nombre").value = producto.nombre;
    document.getElementById("precio").value = producto.precio;
    document.getElementById("categoria").value = producto.categoria;
    document.getElementById("descripcion").value = producto.descripcion;

    document.getElementById("preview-img").src = producto.imagen;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

// =======================
// LIMPIAR FORMULARIO
// =======================
function limpiarFormulario(){
    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("categoria").value = "";
    document.getElementById("descripcion").value = "";

    document.getElementById("imagen").value = null;
    document.getElementById("preview-img").src = "/images/default.png";
}

// =======================
// PREVIEW IMAGEN (ARREGLADO)
// =======================
document.addEventListener("DOMContentLoaded", () => {

    const inputImagen = document.getElementById("imagen");
    const preview = document.getElementById("preview-img");

    if(!inputImagen || !preview){
        console.log("❌ No existe input o preview");
        return;
    }

    inputImagen.addEventListener("change", function(){

        const archivo = this.files[0];

        if(!archivo){
            preview.src = "/images/default.png";
            return;
        }

        const reader = new FileReader();

        reader.onload = function(e){
            preview.src = e.target.result;
        };

        reader.readAsDataURL(archivo);
    });

});

// =======================
// LOGOUT
// =======================
function logout(){
    fetch('/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    })
    .then(res => res.json())
    .then(() => {
        window.location.href = "/";
    });
}

// =======================
// INICIAR
// =======================
cargarProductos();