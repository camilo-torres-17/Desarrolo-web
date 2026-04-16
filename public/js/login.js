function login(){
    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;

    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usuario, password })
    })
    .then(res => res.json())
    .then(data => {
        if(data.success){
            localStorage.setItem("admin", true);
            window.location.href = "/admin";
        } else {
            alert("Datos incorrectos");
        }
    });
}