let unit = 'C';

function setUnit(u) {
  unit = u;
  document.getElementById('btnC').classList.toggle('active', u === 'C');
  document.getElementById('btnF').classList.toggle('active', u === 'F');
  if (window.currentData) renderData(window.currentData);
}

function renderData(data) {
  const { curr, fore } = data;
  renderCurrent(curr);
  renderForecast(fore.list);
  renderFavBtn(curr.name);
  showWeather();
  renderFavs();
}

function renderCurrent(curr) {
  document.getElementById('cityName').textContent    = `${curr.name}, ${curr.sys.country}`;
  document.getElementById('updateTime').textContent  = 'Last updated: ' + new Date().toLocaleString();

  const tempEl = document.getElementById('tempBig');
  tempEl.textContent = toDisplay(curr.main.temp, unit);
  tempEl.classList.remove('temp-hot','temp-warm','temp-cool','temp-cold');
  tempEl.classList.add(tempClass(curr.main.temp));

  document.getElementById('feelsLike').textContent      = 'Feels like ' + toDisplay(curr.main.feels_like, unit);
  document.getElementById('conditionLabel').textContent = curr.weather[0].description.replace(/\b\w/g, c => c.toUpperCase());
  document.getElementById('weatherEmoji').textContent   = condEmoji(curr.weather[0].id);
  document.getElementById('humidity').textContent       = curr.main.humidity + '%';
  document.getElementById('wind').textContent           = (curr.wind.speed * 3.6).toFixed(1) + ' km/h';
  document.getElementById('pressure').textContent       = curr.main.pressure + ' hPa';
  document.getElementById('visibility').textContent     = curr.visibility ? (curr.visibility/1000).toFixed(1)+' km' : '–';
}

function renderForecast(list) {
  const days = parseForecast(list);
  document.getElementById('forecastGrid').innerHTML = days.map(d => {
    const date    = new Date(d.dt * 1000);
    const dayName = date.toLocaleDateString('en', { weekday:'short', day:'numeric', month:'short' });
    return `<div class="forecast-card">
      <div class="fc-day">${dayName}</div>
      <div class="fc-icon">${condEmoji(d.weather[0].id)}</div>
      <div class="fc-high">${toDisplay(d.main.temp_max, unit)}</div>
      <div class="fc-low">${toDisplay(d.main.temp_min, unit)}</div>
    </div>`;
  }).join('');
}

function renderFavBtn(city) {
  document.getElementById('favBtn').textContent = isFav(city) ? '✓ Saved' : '+ Save city';
}

function renderFavs() {
  const favs = loadFavs();
  const sec  = document.getElementById('favSection');
  const list = document.getElementById('favList');
  if (!favs.length) { sec.style.display = 'none'; return; }
  sec.style.display = 'block';
  list.innerHTML = favs.map(f =>
    `<div class="fav-chip">
      <span onclick="loadFavCity('${f}')">${f}</span>
      <button class="fav-remove" onclick="removeFav('${f}')">×</button>
    </div>`
  ).join('');
}

function showAC(cities) {
  const list = document.getElementById('autoList');
  if (!cities.length) { hideAC(); return; }
  list.innerHTML = cities.map(c =>
    `<div class="autocomplete-item" onclick="pickCity('${c.name}, ${c.country}')">
      🌍 <span>${c.name}${c.state ? ', '+c.state : ''}, ${c.country}</span>
    </div>`
  ).join('');
  list.classList.add('show');
}

function hideAC() { document.getElementById('autoList').classList.remove('show'); }

function showLoading() {
  document.getElementById('loadingState').className = 'loading-state show';
  document.getElementById('errorState').className   = 'error-state';
  document.getElementById('emptyState').className   = 'empty-state';
  document.getElementById('weatherMain').className  = 'weather-main';
}

function showError(msg) {
  document.getElementById('errorMsg').textContent   = msg;
  document.getElementById('loadingState').className = 'loading-state';
  document.getElementById('errorState').className   = 'error-state show';
  document.getElementById('emptyState').className   = 'empty-state';
  document.getElementById('weatherMain').className  = 'weather-main';
}

function showWeather() {
  document.getElementById('loadingState').className = 'loading-state';
  document.getElementById('errorState').className   = 'error-state';
  document.getElementById('emptyState').className   = 'empty-state';
  document.getElementById('weatherMain').className  = 'weather-main show';
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}