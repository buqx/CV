const boton = document.getElementById("crearBtn");
const lista = document.getElementById("listaProductos");

boton.addEventListener("click", function () {
  const nombre = document.getElementById("nombre").value.trim();
  const precio = document.getElementById("precio").value.trim();
  const imagen = document.getElementById("imagen").value.trim();

 
  if (nombre === "" || precio === "" || imagen === "") {
    const alerta = document.createElement("div");
    alerta.className = "alert alert-danger mt-3 text-center";
    alerta.textContent = "Complete todos los campos";
    lista.parentElement.prepend(alerta);
    setTimeout(() => {
        alerta.remove();
    }, 2000);
    return;
  }

  const col = document.createElement("div");
  col.className = "col-md-4 d-flex justify-content-center mb-4";


  col.innerHTML = `
    <div class="card shadow" style="width: 18rem;">
      <img src="${imagen}" class="card-img-top" style="height: 200px; object-fit: cover;" alt="producto">
      <div class="card-body text-center">
        <h5 class="card-title">${nombre}</h5>
        <p class="card-text text-success fw-bold">$${precio}</p>
      </div>
    </div>
  `;

 
  lista.appendChild(col);

  const mensaje = document.createElement("div");
  mensaje.className = "alert alert-success mt-3 text-center";
  mensaje.textContent = "Producto creado correctamente";


  lista.parentElement.prepend(mensaje);

  setTimeout(() => {
    mensaje.remove();
  }, 2000);


  document.getElementById("nombre").value = "";
  document.getElementById("precio").value = "";
  document.getElementById("imagen").value = "";
});
