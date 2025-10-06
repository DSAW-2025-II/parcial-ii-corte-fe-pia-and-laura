const BACKEND_URL = "https://parcial-ii-corte-be-pia-and-laura-zeta.vercel.app/api/v1";

const loginSection = document.getElementById("login-section");
const pokemonSection = document.getElementById("pokemon-section");
const loginError = document.getElementById("login-error");
const searchError = document.getElementById("search-error");
const pokemonResult = document.getElementById("pokemon-result");

// Si ya hay token, muestra la sección de búsqueda
const token = localStorage.getItem("sessionToken");
if (token) showPokemonSection();

// ---- LOGIN ----
document.getElementById("login-btn").addEventListener("click", async () => {
  loginError.textContent = "";

  // Credenciales fijas del admin
  const email = "admin@admin.com";
  const password = "admin";

  try {
    const res = await fetch(`${BACKEND_URL}/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al iniciar sesión");

    localStorage.setItem("sessionToken", data.token);
    showPokemonSection();
  } catch (err) {
    loginError.textContent = err.message;
  }
});

// ---- BUSCAR POKÉMON ----
document.getElementById("search-btn").addEventListener("click", async () => {
  const pokemonName = document.getElementById("pokemon-name").value.trim();
  searchError.textContent = "";
  pokemonResult.innerHTML = "";

  if (!pokemonName) {
    searchError.textContent = "Por favor ingresa un nombre.";
    return;
  }

  try {
    const res = await fetch(`${BACKEND_URL}/pokemonDetails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("sessionToken"),
      },
      body: JSON.stringify({ pokemonName }),
    });

    const data = await res.json();
    if (!res.ok || !data.name) throw new Error("Ups! Pokémon no encontrado");

    pokemonResult.innerHTML = `
      <img src="${data.img_url}" alt="${data.name}">
      <h3>${data.name}</h3>
      <p><strong>Tipo:</strong> ${data.species}</p>
      <p><strong>Peso:</strong> ${data.weight}</p>
    `;
  } catch (err) {
    searchError.textContent = err.message;
  }
});

// ---- CERRAR SESIÓN ----
document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("sessionToken");
  showLoginSection();
});

// ---- Funciones auxiliares ----
function showPokemonSection() {
  loginSection.style.display = "none";
  pokemonSection.style.display = "block";
}

function showLoginSection() {
  pokemonSection.style.display = "none";
  loginSection.style.display = "block";
}
