  document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.getElementById("form-contacto");
  const erroresDiv = document.getElementById("errores");

  formulario.addEventListener("submit", function (e) {
    e.preventDefault();
    erroresDiv.innerHTML = ""; // Limpiar errores previos
    let errores = [];

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();

    // Validar nombre
    if (nombre.length <= 3) {
      errores.push("❌ El nombre debe tener más de 3 letras.");
    }

    // Validar correo
    if (!email.includes("@")) {
      errores.push("❌ El correo debe contener un '@'.");
    }

    // Validar mensaje (más de 5 palabras)
    const palabras = mensaje.split(/\s+/);
    if (palabras.length < 6) {
      errores.push("❌ El mensaje debe tener al menos 6 palabras.");
    }

    // Mostrar errores o enviar
    if (errores.length > 0) {
      errores.forEach(error => {
        const p = document.createElement("p");
        p.textContent = error;
        erroresDiv.appendChild(p);
      });
    } else {
      alert("✅ Formulario enviado con éxito!");
      formulario.reset(); // Podés cambiar esto por un fetch o redirección
    }
  });
});
