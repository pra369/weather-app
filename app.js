let lastCity   = null;
let lastCoords = null;
let acTimer    = null;
window.currentData = null;

function searchCity() {
  const q = document.getElementById('searchInput').value.trim();
  if (q) loadCity(q);
}

function onSearchKey(e) {
  if (e.key === 'Enter') searchCity();
}

function onSearchInput() {
  clearTimeout(acTimer);
  const q = document.getElementById('searchInput').value.trim();
  if (q.length < 2) { hideAC(); return; }
  acTimer = setTimeout(async () => {
    try { showAC(await fetchCitySuggestions(q)); }
    catch { hideAC(); }
  }, CONFIG.DEBOUNCE_MS);
}

function pickCity(name) {
  document.getElementById('searchInput').value = name;
  hideAC();
  loadCity(name);
}

async function loadCity(city) {
  showLoading();
  lastCity = city;
  try {
    const data = await fetchWeather(city);
    window.currentData = data;
    renderData(data);
  } catch(e) {
    showError(e.message || 'Could not fetch weather data.');
  }
}

function loadFavCity(city) {
  document.getElementById('searchInput').value = city;
  loadCity(city);
}

function useLocation() {
  if (!navigator.geolocation) { showToast('Geolocation not supported.'); return; }
  showLoading();
  navigator.geolocation.getCurrentPosition(
    async pos => {
      const { latitude: lat, longitude: lon } = pos.coords;
      lastCoords = { lat, lon };
      try {
        const data = await fetchWeatherByCoords(lat, lon);
        window.currentData = data;
        lastCity = data.city;
        renderData(data);
      } catch(e) {
        showError('Could not fetch weather for your location.');
      }
    },
    () => showError('Location access denied. Please search a city.')
  );
}

function retryLast() {
  if (lastCity) loadCity(lastCity);
}

function toggleFavorite() {
  if (!window.currentData) return;
  const city = window.currentData.curr.name;
  if (isFav(city)) {
    removeFavCity(city);
    showToast(`Removed ${city} from saved cities.`);
  } else {
    addFav(city);
    showToast(`✓ Saved ${city}!`);
  }
  renderFavBtn(city);
  renderFavs();
}

function removeFav(city) {
  removeFavCity(city);
  renderFavs();
  if (window.currentData && window.currentData.curr.name === city) {
    document.getElementById('favBtn').textContent = '+ Save city';
  }
}

// Init
renderFavs();
document.addEventListener('click', e => {
  const wrap = document.querySelector('.search-wrap');
  if (wrap && !wrap.contains(e.target)) hideAC();
});