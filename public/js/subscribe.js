document.addEventListener("DOMContentLoaded", () => {
  const footerSection = document.querySelector("footer section");
  if (!footerSection) return;

  const subscribeDiv = document.createElement("div");
  subscribeDiv.className = "subscribe-column";
  subscribeDiv.innerHTML =
        `<div class="registro-box">

    <h2>Crear cuenta</h2>

    <input type="text" id="registro-nombre" placeholder="Nombre">

    <input type="email" id="registro-email" placeholder="Correo">

    <input type="password" id="registro-password" placeholder="Contraseña">

    <button onclick="registrarUsuario()">
        Registrarse
    </button>

</div>`;
  footerSection.appendChild(subscribeDiv);

  const form = document.getElementById("subscribe-form");
  const message = document.getElementById("subscribe-message");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    message.textContent = "";

    const email = document.getElementById("subscribe-email").value.trim();
    if (!email) {
      message.textContent = "Ingresa un correo válido.";
      return;
    }

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include",
      });
      const result = await response.json();

      if (response.ok && result.success) {
        message.textContent = result.message || "Suscripción realizada.";
        message.style.color = "#2e7d32";
        form.reset();
      } else {
        message.textContent = result.error || "No fue posible suscribirte.";
        message.style.color = "#b71c1c";
      }
    } catch (error) {
      message.textContent = "Error de conexión. Intenta de nuevo.";
      message.style.color = "#b71c1c";
    }
  });
});

function registrarUsuario(){

    const nombre = document.getElementById("registro-nombre").value;

    const email = document.getElementById("registro-email").value;

    const password = document.getElementById("registro-password").value;

    fetch('/api/register', {

        method: 'POST',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            nombre,
            email,
            password
        })

    })

    .then(async res => {

        const data = await res.json();

        if(!res.ok){

            alert(data.error);

            return;
        }

        alert("Usuario registrado correctamente");

        // LIMPIAR
        document.getElementById("registro-nombre").value = "";

        document.getElementById("registro-email").value = "";

        document.getElementById("registro-password").value = "";

    })

    .catch(error => {

        console.log(error);

    });

}
