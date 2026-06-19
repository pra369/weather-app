async function fetchWeather(city) {
  const cached = getCached(city);
  if (cached) return cached;

  const [currRes, foreRes] = await Promise.all([
    fetch(`${CONFIG.BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${CONFIG.API_KEY}`),
    fetch(`${CONFIG.BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${CONFIG.API_KEY}`)
  ]);

  if (!currRes.ok) {
    if (currRes.status === 404) throw new Error('City not found. Please check the spelling.');
    if (currRes.status === 401) throw new Error('Invalid API key. Check js/config.js');
    throw new Error(`API error: ${currRes.status}`);
  }

  const curr = await currRes.json();
  const fore = await foreRes.json();
  const data = { curr, fore, city: curr.name };

  saveCache(city, data);
  return data;
}

async function fetchWeatherByCoords(lat, lon) {
  const [currRes, foreRes] = await Promise.all([
    fetch(`${CONFIG.BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${CONFIG.API_KEY}`),
    fetch(`${CONFIG.BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${CONFIG.API_KEY}`)
  ]);
  if (!currRes.ok) throw new Error(`API error: ${currRes.status}`);
  const curr = await currRes.json();
  const fore = await foreRes.json();
  return { curr, fore, city: curr.name };
}

async function fetchCitySuggestions(query) {
  const res = await fetch(
    `${CONFIG.GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=${CONFIG.GEO_LIMIT}&appid=${CONFIG.API_KEY}`
  );
  if (!res.ok) throw new Error('Autocomplete failed');
  return await res.json();
}

function toDisplay(kelvin, unit) {
  if (unit === 'F') return ((kelvin - 273.15) * 9/5 + 32).toFixed(1) + '°F';
  return (kelvin - 273.15).toFixed(1) + '°C';
}

function condEmoji(id) {
  if (id >= 200 && id < 300) return '⛈️';
  if (id >= 300 && id < 400) return '🌦️';
  if (id >= 500 && id < 600) return '🌧️';
  if (id >= 600 && id < 700) return '❄️';
  if (id >= 700 && id < 800) return '🌫️';
  if (id === 800)             return '☀️';
  if (id === 801)             return '🌤️';
  if (id === 802)             return '⛅';
  return '☁️';
}

function tempClass(kelvin) {
  const c = kelvin - 273.15;
  if (c >= 35) return 'temp-hot';
  if (c >= 20) return 'temp-warm';
  if (c >= 10) return 'temp-cool';
  return 'temp-cold';
}

function parseForecast(list) {
  const daily = {};
  (list || []).forEach(item => {
    const day = item.dt_txt.split(' ')[0];
    if (!daily[day]) daily[day] = item;
  });
  return Object.values(daily).slice(0, 5);
}