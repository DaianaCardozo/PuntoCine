 // script.js

document.addEventListener('DOMContentLoaded', () => {
  cargarJSON();
  mostrarWishList();
});

async function cargarJSON() {
  try {
    const response = await fetch('productos.json'); // Tu archivo JSON está en la raíz
    const data = await response.json();

    const seccionProducto = document.getElementById('seccion_productos');
    seccionProducto.innerHTML = ''; // Limpia por si acaso

    const contenedorProductos = document.createElement('div');
    contenedorProductos.classList.add('contenedor-producto');

    data.forEach(producto => {
      let card = document.createElement('div');
      card.classList.add('card');

      // Imagen
      let img = document.createElement('img');
      img.className = 'imagen';
      img.src = producto.image;
      img.alt = producto.name;
      card.appendChild(img);

      // Precio
      let divPrecio = document.createElement('div');
      divPrecio.textContent = `$${producto.price}`;
      card.appendChild(divPrecio);

      // Nombre
      let divNombre = document.createElement('div');
      divNombre.className = 'nombre';
      divNombre.textContent = producto.name;
      card.appendChild(divNombre);

      // Descripción
      let divDesc = document.createElement('div');
      divDesc.className = 'desc';
      divDesc.textContent = producto.description;
      card.appendChild(divDesc);

      // Botón
      let boton = document.createElement('button');
      boton.className = 'button';
      boton.textContent = 'Agregar 🛒';
      boton.addEventListener('click', () => {
        addWishList(producto);
      });
      card.appendChild(boton);

      contenedorProductos.appendChild(card);
    });

    seccionProducto.appendChild(contenedorProductos);

  } catch (error) {
    console.error("Error al obtener productos:", error);
    document.getElementById('seccion_productos').innerHTML = '<p class="error">No se pudieron cargar los productos.</p>';
  }
}

function addWishList(producto) {
  try {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    const index = wishlist.findIndex(item => item.id === producto.id);
    if (index !== -1) {
      wishlist[index].cantidad = (wishlist[index].cantidad || 1) + 1;
    } else {
      wishlist.push({ ...producto, cantidad: 1 });
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    mostrarWishList();
  } catch (error) {
    console.error("Error al agregar a la lista:", error);
  }
}

function mostrarWishList() {
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  let lista = document.getElementById('wishlist-list');

  if (!lista) {
    const wishlistSection = document.createElement('section');
    wishlistSection.id = 'wishlist';

    const titulo = document.createElement('h2');
    titulo.textContent = 'Carrito de Productos';

    lista = document.createElement('ul');
    lista.id = 'wishlist-list';

    const botonEliminar = document.createElement('button');
    botonEliminar.textContent = 'Vaciar carrito';
    botonEliminar.addEventListener('click', () => {
      localStorage.removeItem('wishlist');
      mostrarWishList();
    });

    wishlistSection.appendChild(titulo);
    wishlistSection.appendChild(lista);
    wishlistSection.appendChild(botonEliminar);

    document.body.appendChild(wishlistSection);
  } else {
    lista.innerHTML = '';
  }

  wishlist.forEach(producto => {
    const li = document.createElement('li');
    li.textContent = `${producto.name} - Cantidad: ${producto.cantidad}`;
    lista.appendChild(li);
  });
}
