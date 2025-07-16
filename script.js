const contenedor = document.querySelector('.contenedor');
const count = document.getElementById('count');
const total = document.getElementById('total');
const peliculaSelect = document.getElementById('pelicula');

const precioEntrada = 10000;
let ticketPrice = precioEntrada;

// API KEY de TMDb
let apiKey = localStorage.getItem('tmdbApiKey');

if (!apiKey) {
  apiKey = prompt("Por favor, ingresá tu API key de TMDb:");
  if (apiKey) {
    localStorage.setItem('tmdbApiKey', apiKey);
  } else {
    alert("No se ingresó ninguna API key. La página no funcionará correctamente.");
  }
}


function getTodosLosAsientos() {
  return document.querySelectorAll('.fila .asiento:not(.ocupado)');
}

function updateSelectedCount() {
  const asientosSeleccionados = document.querySelectorAll('.fila .asiento.seleccionado');
  const todosLosAsientos = getTodosLosAsientos();
  const asientosIndex = [...asientosSeleccionados].map(asiento =>
    [...todosLosAsientos].indexOf(asiento)
  );

  // Usá el ID de la película para guardar la selección
  localStorage.setItem(`asientosSeleccionados_${movieId}`, JSON.stringify(asientosIndex));

  const countSelected = asientosSeleccionados.length;
  count.innerText = countSelected;
  total.innerText = countSelected * ticketPrice;
}


function populateUI() {
  const asientosGuardados = JSON.parse(localStorage.getItem(`asientosSeleccionados_${movieId}`));
  const todosLosAsientos = getTodosLosAsientos();

  if (asientosGuardados !== null && asientosGuardados.length > 0) {
    todosLosAsientos.forEach((asiento, index) => {
      if (asientosGuardados.indexOf(index) > -1) {
        asiento.classList.add('seleccionado');
      }
    });
  }

  const selectedPeliculaIndex = localStorage.getItem('selectedPeliculaIndex');
  if (selectedPeliculaIndex !== null) {
    peliculaSelect.selectedIndex = selectedPeliculaIndex;
  }

  updateSelectedCount();
}


if (peliculaSelect) {
  peliculaSelect.addEventListener('change', (e) => {
    const selectedId = e.target.value;
    const selectedIndex = e.target.selectedIndex;

    localStorage.setItem('selectedPeliculaIndex', selectedIndex);
    ticketPrice = precioEntrada;
    updateSelectedCount();
    cargarPeliculaDesdeAPI(selectedId);
  });
}

contenedor.addEventListener('click', (e) => {
  if (e.target.classList.contains('asiento') && !e.target.classList.contains('ocupado')) {
    e.target.classList.toggle('seleccionado');
    updateSelectedCount();
  }
});

// Función para cargar los datos desde TMDb
async function cargarPeliculaDesdeAPI(movieId) {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=es-ES`);
    const data = await res.json();

    document.getElementById("poster").src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
    document.getElementById("titulo").innerText = data.title;
    document.getElementById("genero").innerText = data.genres.map(g => g.name).join(" / ");
    document.getElementById("descripcion").innerText = data.overview;
    document.getElementById("duracion").innerText = `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m`;

    // 🔎 NUEVO: obtener créditos para encontrar el director
    const resCredits = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`);
    const creditsData = await resCredits.json();
    const director = creditsData.crew.find(p => p.job === "Director");
    document.getElementById("director").innerText = director ? director.name : "Desconocido";

    // 🎬 Trailer
    const resTrailer = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=es-ES`);
    const trailerData = await resTrailer.json();
    const trailer = trailerData.results.find(v => v.type === "Trailer" && v.site === "YouTube");

    if (trailer) {
      document.getElementById("trailer").src = `https://www.youtube.com/embed/${trailer.key}`;
    }

  } catch (err) {
    console.error("Error al cargar la película:", err);
  }
}


// 🟢 Obtener ID desde la URL
const params = new URLSearchParams(window.location.search);
const movieId = params.get('id');

// Inicializar la interfaz
populateUI();

// 🟣 Si hay ID en la URL, cargar esa película
if (movieId) {
  cargarPeliculaDesdeAPI(movieId);
} else {
  // Si no hay ID en la URL, cargar la película seleccionada por defecto (desde el select)
  cargarPeliculaDesdeAPI(peliculaSelect.value);
}


