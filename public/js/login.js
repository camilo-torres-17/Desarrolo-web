function login(){
    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;

    if (!usuario || !password) {
        alert("Por favor completa los campos");
        return;
    }

    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usuario, password }),
        credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
        console.log('Login response:', data);
        if(data.success){
            window.location.href = "/admin";
        } else {
            alert("Datos incorrectos. Usuario: admin, Contraseña: 1234");
        }
    })
    .catch(error => {
        console.error('Login error:', error);
        alert("Error de conexión");
    });
}
