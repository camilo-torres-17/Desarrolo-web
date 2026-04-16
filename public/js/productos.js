const API = "/api/productos";

// CARGAR PRODUCTOS
function cargarProductos(categoria){

    fetch(API)
    .then(res => res.json())
    .then(productos => {

        let contenedor = document.getElementById("contenedor-productos");
        if(!contenedor) return;

        contenedor.innerHTML = "";

        // FILTRAR POR CATEGORIA
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

                        <button class="btn-comprar"
                        onclick="event.stopPropagation(); comprar('${p.nombre}')">
                        <i class="fas fa-credit-card"></i> Comprar
                        </button>
                    </div>

                </article>
            `;
        });
    })
    .catch(error => console.log("Error cargando productos:", error));
}