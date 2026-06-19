# 🌤️ WeatherNow — Weather Application

🔗 **Live Demo:** [weather-app-mocha-seven-13.vercel.app](https://weather-app-mocha-seven-13.vercel.app/)
📂 **GitHub Repository:** [github.com/pra369/week4-weather-app](https://github.com/pra369/week4-weather-app)

---

## Project Overview

WeatherNow is a responsive weather application that fetches real-time weather data from the OpenWeatherMap API. The goal of this project was to practice connecting a frontend interface to a public REST API, handle asynchronous JavaScript 
- 📅 5-day weather forecast
- 🏙️ City search with autocomplete suggestions
- 🌡️ Celsius / Fahrenheit temperature conversion
- ⭐ Favorite cities storage (saved locally)
- 📱 Fully responsive design (mobile, tablet, desktop)
- ⚠️ Error handling and loading states
- 📍 GPS-based "Use my location" detection
- 💾 Local data caching to reduce repeated API calls

---

## Setup Instructions

1. **Get an API key** from [OpenWeatherMap](https://openweathermap.org/api) (free tier — sign up, verify email, copy key from "API keys" tab)
2. **Copy `.env.example` to `.env`** and add your API key as a reference:
   ```
   OPENWEATHER_API_KEY=your_api_key_here
   ```
3. Open `js/config.js` and paste the same key into the `API_KEY` field
4. **Run the app** — open `index.html` directly in your browser, or use the VS Code **Live Server** extension, or deploy to GitHub Pages / Vercel

---

## API Used

**OpenWeatherMap API** — Free tier

| Endpoint | Purpose |
|---|---|
| `/data/2.5/weather` | Current weather by city name or coordinates |
| `/data/2.5/forecast` | 5-day forecast (3-hour interval data) |
| `/geo/1.0/direct` | Geocoding — powers city autocomplete search |

---

## Code Structure

```
week4-weather-app/
│── index.html               # Main HTML structure
│── css/
│   ├── style.css             # Core layout, design tokens, components
│   ├── weather-icons.css     # Icon animations & condition badges
│   └── responsive.css        # Mobile/tablet breakpoints
│── js/
│   ├── config.js              # API key & configuration constants
│   ├── storage.js             # localStorage helpers (cache + favorites)
│   ├── weatherService.js      # API calls, data parsing, helper functions
│   ├── ui.js                  # DOM rendering & UI state functions
│   └── app.js                 # Main app logic — search, events, init
│── assets/
│   └── icons/                 # Optional custom icon assets
│── README.md
│── .env.example
└── .gitignore
```

Each JavaScript file has a single responsibility, following separation-of-concerns principles common in real-world frontend projects.

---

## Component Architecture

```
┌─────────────┐      types/clicks       ┌──────────────┐
│   index.html │ ───────────────────────▶│   app.js      │
│  (UI Layer)  │                          │ (Controller)  │
└─────────────┘                          └──────┬───────┘
                                                  │ calls
                                                  ▼
                                       ┌─────────────────────┐
                                       │  weatherService.js   │
                                       │  (API Layer)         │
                                       └──────┬───────┬──────┘
                                              │       │
                              checks/saves    │       │   fetch()
                                              ▼       ▼
                                   ┌──────────────┐ ┌───────────────────┐
                                   │  storage.js   │ │ OpenWeatherMap API │
                                   │ (localStorage)│ └───────────────────┘
                                   └──────────────┘

                                       │
                                       ▼ returns data
                                ┌─────────────┐
                                │    ui.js     │
                                │ (View Layer) │
                                └─────────────┘
                                       │
                                       ▼
                              Updates DOM (index.html)
```

**Data flow:**
1. User types/searches a city → `app.js` captures the event
2. `app.js` calls `weatherService.js` → checks `storage.js` cache first
3. If not cached, fetches live data from OpenWeatherMap API
4. Response is parsed and passed to `ui.js`
5. `ui.js` renders the current weather card and 5-day forecast grid into the DOM

---

## Technical Details

- **Async Programming:** All API calls use `async/await` with `Promise.all()` to fetch current weather and forecast data in parallel, reducing load time
- **Data Structures:** Forecast data (3-hour intervals) is grouped into a JS object keyed by date, then converted to an array and sliced to 5 entries — one per day
- **Error Handling:** HTTP response codes are checked explicitly (`404` → city not found, `401` → invalid API key, other → generic API error), each producing a clear user-facing message
- **Caching Algorithm:** Each city's weather data is stored in `localStorage` with a timestamp; on next request, if the timestamp is within a 10-minute TTL (time-to-live), cached data is returned instead of calling the API again
- **Debouncing:** The autocomplete search uses a 350ms debounce timer (`setTimeout`/`clearTimeout`) to avoid firing an API request on every keystroke
- **Unit Conversion:** Temperatures are stored in Kelvin (API default) and converted on render: `°C = K − 273.15`, `°F = (K − 273.15) × 9/5 + 32`

---

## Testing Evidence

Manual testing was performed for the following cases:

| Test Case | Input | Expected Result | Result |
|---|---|---|---|
| Valid city search | "Mumbai" | Weather card + forecast load | ✅ Pass |
| Invalid city | "asdkjasd" | Friendly error message shown | ✅ Pass |
| Unit toggle | Click °F | All temperatures convert instantly | ✅ Pass |
| GPS location | Click "Use my location" | Weather loads for current city | ✅ Pass |
| Save favorite | Click "+ Save city" | City chip appears, persists on reload | ✅ Pass |
| Cache check | Search same city twice within 10 min | Second load is instant (no API call) | ✅ Pass |
| Responsive layout | Resize to mobile width | Forecast grid adjusts to 3 columns | ✅ Pass |
| API key error | Invalid key in config.js | "Invalid API key" message shown | ✅ Pass |

---

## Visual Documentation

*(Add screenshots here before submitting — see instructions below)*

1. Desktop view — search results with current weather + forecast
2. Mobile/responsive view
3. Error state (invalid city)
4. Loading state (spinner)
5. Saved favorites list

> 📸 **How to add screenshots:** Take screenshots of your running app, save them in an `assets/images/` folder, then reference them here like:
> `![Desktop view](assets/images/desktop-view.png)`

---

## Tech Stack

- HTML5, CSS3 (Grid & Flexbox), Vanilla JavaScript (ES6+)
- OpenWeatherMap REST API
- Browser `localStorage` for caching and favorites
- Deployed via Vercel

---
screenshot of live website
<img width="1294" height="699" alt="s1" src="https://github.com/user-attachments/assets/ca511588-327e-45c7-8eec-25c4c051e82a" />

<img width="1314" height="720" alt="s3" src="https://github.com/user-attachments/assets/06f12368-ded5-4e3d-8f68-738c1a166012" />



*Week 4 Final Project — Frontend Integration & API*
