// OBTENER CARRITO
function obtenerCarrito() {
  return JSON.parse(localStorage.getItem("carrito")) || [];
}

// GUARDAR CARRITO
function guardarCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// MOSTRAR PRODUCTOS EN CARRITO
function mostrarCarrito() {
  let carrito = obtenerCarrito();
  let contenedor = document.getElementById("lista-carrito");
  let total = 0;

  if (!contenedor) return;

  contenedor.innerHTML = "";

  if (carrito.length === 0) {
    contenedor.innerHTML = "<p>Tu carrito está vacío 🛒</p>";
    document.getElementById("total-carrito").innerText = "";
    actualizarContador();
    return;
  }

  carrito.forEach((producto, index) => {
    total += parseInt(producto.precio);

    contenedor.innerHTML += `
        <div class="item-carrito">
            <img src="${producto.imagen}">
            <div>
                <p>${producto.nombre}</p>
                <p>$${Number(producto.precio).toLocaleString()}</p>
            </div>
            <button onclick="eliminarProducto(${index})">❌</button>
        </div>
        `;
  });

  document.getElementById("total-carrito").innerText =
    "Total: $" + total.toLocaleString();

  actualizarContador();
}

// ELIMINAR PRODUCTO
function eliminarProducto(index) {
  let carrito = obtenerCarrito();
  carrito.splice(index, 1);
  guardarCarrito(carrito);
  mostrarCarrito();
}

// AGREGAR PRODUCTO
function agregarCarrito(nombre, precio, imagen) {
  let carrito = obtenerCarrito();

  carrito.push({ nombre, precio, imagen });

  guardarCarrito(carrito);
  actualizarContador();

  alert(nombre + " agregado al carrito 🛒");
}

// CONTADOR
function actualizarContador() {
  let carrito = obtenerCarrito();
  let contador = document.getElementById("contador-carrito");

  if (contador) {
    contador.innerText = carrito.length;
  }
}

// EJECUTAR AUTOMATICO
document.addEventListener("DOMContentLoaded", () => {
  mostrarCarrito();
  actualizarContador();
});
