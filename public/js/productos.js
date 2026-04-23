const API = "/api/productos";

// 🔹 CARGAR PRODUCTOS
function cargarProductos(categoria){

    fetch(API)
    .then(res => res.json())
    .then(productos => {

        let contenedor = document.getElementById("contenedor-productos");
        if(!contenedor) return;

        contenedor.innerHTML = "";

        let filtrados = categoria 
            ? productos.filter(p => p.categoria === categoria)
            : productos;

        filtrados.forEach(p => {
            contenedor.innerHTML += `
                <article class="tarjeta"
                onclick="verDetalle(
                    '${p.nombre}',
                    '${p.precio}',
                    '${p.descripcion || "Sin descripción"}',
                    '${p.imagen}',
                    '${p.descuento || "Sin descuento"}'
                )">

                    <img src="${p.imagen}" class="producto-img">

                    <div class="caja">
                        <p>${p.nombre}</p>
                        <p>$${Number(p.precio).toLocaleString()}</p>
                    </div>

                    <div class="botones-producto">
                        <button class="btn-carrito"
                        onclick="event.stopPropagation(); agregarCarrito('${p.nombre}','${p.precio}','${p.imagen}')">
                        <i class="fas fa-cart-plus"></i> Agregar
                        </button>
                    </div>

                </article>
            `;
        });

    })
    .catch(error => console.log("Error cargando productos:", error));
}


// 🔍 BUSCADOR (EN TIEMPO REAL)
function buscarProductos(){

    let input = document.getElementById("input-busqueda");
    let contenedor = document.getElementById("resultados-busqueda");

    if(!input || !contenedor) return;

    let texto = input.value.toLowerCase();

    // 👉 si está vacío, limpiar
    if(texto === ""){
        contenedor.innerHTML = "";
        return;
    }

    fetch(API)
    .then(res => res.json())
    .then(productos => {

        contenedor.innerHTML = "";

        let filtrados = productos.filter(p =>
            p.nombre.toLowerCase().includes(texto) ||
            p.categoria.toLowerCase().includes(texto)
        );

        if(filtrados.length === 0){
            contenedor.innerHTML = "<p>No se encontraron productos</p>";
            return;
        }

        filtrados.forEach(p => {
    contenedor.innerHTML += `
        <div class="item-busqueda"
        onclick="verDetalle(
            '${p.nombre}',
            '${p.precio}',
            '${p.descripcion || ""}',
            '${p.imagen}',
            'Sin descuento'
        )">

            <div class="item-info">
                <img src="${p.imagen}">
                <div class="item-texto">
                    <span class="item-nombre">${p.nombre}</span>
                    <small>Categoría: ${p.categoria}</small>
                </div>
            </div>

            <div style="display:flex; align-items:center; gap:10px;">

                <div class="item-precio">
                    $${Number(p.precio).toLocaleString()}
                </div>

                <!-- 🔥 BOTÓN CARRITO -->
                <button class="btn-carrito-mini"
                onclick="event.stopPropagation(); agregarCarrito('${p.nombre}','${p.precio}','${p.imagen}')">
                    <i class="fas fa-cart-plus"></i>
                </button>

            </div>

        </div>
    `;
});

if(texto === ""){
    contenedor.innerHTML = "";
    return;
}

    })
    .catch(err => console.log("Error en búsqueda:", err));
}


// 🔥 ACTIVAR BUSCADOR AUTOMÁTICO
document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("input-busqueda");

    if(!input) return;

    input.addEventListener("input", buscarProductos);

});

document.addEventListener("click", (e) => {
    if(!e.target.closest(".w-header")){
        document.getElementById("resultados-busqueda").innerHTML = "";
    }
});