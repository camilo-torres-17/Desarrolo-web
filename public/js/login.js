function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Por favor completa los campos");
    return;
  }

  fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Login response:", data);
      if (data.success) {
        window.location.href = "/admin";
      } else {
        alert("Email o contraseña incorrectos");
      }
    })
    .catch((error) => {
      console.error("Login error:", error);
      alert("Error de conexión");
    });
}
