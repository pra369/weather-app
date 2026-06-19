const CACHE_KEY = 'wnow_cache';
const FAV_KEY   = 'wnow_favs';

function loadCache() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY)) || {}; }
  catch { return {}; }
}

function saveCache(city, data) {
  const cache = loadCache();
  cache[city.toLowerCase()] = { data, ts: Date.now() };
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); }
  catch(e) { console.warn('Cache save failed:', e); }
}

function getCached(city) {
  const entry = loadCache()[city.toLowerCase()];
  if (entry && Date.now() - entry.ts < CONFIG.CACHE_TTL) return entry.data;
  return null;
}

function loadFavs() {
  try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; }
  catch { return []; }
}

function saveFavs(arr) {
  try { localStorage.setItem(FAV_KEY, JSON.stringify(arr)); }
  catch(e) { console.warn('Favs save failed:', e); }
}

function addFav(city) {
  const favs = loadFavs();
  if (!favs.includes(city)) { favs.push(city); saveFavs(favs); }
}

function removeFavCity(city) {
  saveFavs(loadFavs().filter(f => f !== city));
}

function isFav(city) {
  return loadFavs().includes(city);
}