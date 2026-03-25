// =============================================
const API_KEY = '3671d171df0d421eaac94754262503';
// =============================================

let weatherData = {};
let isCelsius = true;
 
const input   = document.getElementById('location-input');
const loader  = document.getElementById('loader');
const errBox  = document.getElementById('error-box');
const errText = document.getElementById('error-text');
const content = document.getElementById('weather-content');
 
document.getElementById('search-btn').addEventListener('click', fetchWeather);
input.addEventListener('keydown', e => { if (e.key === 'Enter') fetchWeather(); });
 
function setUnit(unit) {
    isCelsius = (unit === 'c');
    document.getElementById('btn-c').classList.toggle('active', isCelsius);
    document.getElementById('btn-f').classList.toggle('active', !isCelsius);
    if (Object.keys(weatherData).length) updateDisplay();
}
 
function fetchWeather() {
    const place = input.value.trim();
    if (!place) { showError('Please enter a city name.'); return; }
 
    showLoader();
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${place}&days=5&aqi=yes`)
        .then(r => { if (!r.ok) throw new Error('not found'); return r.json(); })
        .then(data => { weatherData = data; isCelsius = true; setUnit('c'); showWeather(); })
        .catch(() => showError('City not found. Please check the spelling and try again.'));
}
 
function showWeather() {
    hideLoader(); hideError();
    content.style.display = 'block';
    updateDisplay();
}
 
function updateDisplay() {
    const loc = weatherData.location;
    const cur = weatherData.current;
 
    document.getElementById('city-name').textContent = `${loc.name}, ${loc.country}`;
    document.getElementById('current-date').textContent = new Date(loc.localtime).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
 
    document.getElementById('weather-icon').src = `https:${cur.condition.icon}`;
    document.getElementById('weather-description').textContent = cur.condition.text;
    document.getElementById('wind-speed').textContent = cur.wind_kph;
    document.getElementById('humidity').textContent = cur.humidity;
    document.getElementById('clouds').textContent = cur.cloud;
    document.getElementById('visibility').textContent = cur.vis_km;
    document.getElementById('uv-index').textContent = cur.uv;
 
    // AQI badge
    const aqiVal = cur.air_quality?.['us-epa-index'];
    const aqiLabels = ['','Good','Moderate','Unhealthy*','Unhealthy','Very Unhealthy','Hazardous'];
    const badge = document.getElementById('aqi-badge');
    badge.textContent = aqiVal ? `AQI · ${aqiLabels[aqiVal] || aqiVal}` : '';
    badge.style.display = aqiVal ? 'block' : 'none';
 
    // Temperature
    if (isCelsius) {
        document.getElementById('current-temp').textContent = Math.round(cur.temp_c);
        document.getElementById('unit-label').textContent = '°C';
        document.getElementById('feels-like').textContent = Math.round(cur.feelslike_c);
        document.getElementById('feels-unit').textContent = '°C';
    } else {
        document.getElementById('current-temp').textContent = Math.round(cur.temp_f);
        document.getElementById('unit-label').textContent = '°F';
        document.getElementById('feels-like').textContent = Math.round(cur.feelslike_f);
        document.getElementById('feels-unit').textContent = '°F';
    }
 
    renderForecast();
}
 
function renderForecast() {
    const container = document.getElementById('forecast-days');
    container.innerHTML = '';
 
    weatherData.forecast.forecastday.forEach(day => {
        const d = new Date(day.date);
        const high = isCelsius ? `${Math.round(day.day.maxtemp_c)}°C` : `${Math.round(day.day.maxtemp_f)}°F`;
        const low  = isCelsius ? `${Math.round(day.day.mintemp_c)}°C` : `${Math.round(day.day.mintemp_f)}°F`;
 
        const card = document.createElement('div');
        card.className = 'forecast-day';
        card.innerHTML = `
            <p class="fc-day">${d.toLocaleDateString('en-US',{weekday:'short'})}</p>
            <p class="fc-date">${d.toLocaleDateString('en-US',{month:'short',day:'numeric'})}</p>
            <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">
            <p class="fc-cond">${day.day.condition.text}</p>
            <div class="forecast-temp">
                <span>${high}</span>
                <span>${low}</span>
            </div>
            <div class="fc-rain"><i class="fas fa-umbrella"></i> ${day.day.daily_chance_of_rain}%</div>
        `;
        container.appendChild(card);
    });
}
 
function showLoader() { loader.classList.remove('hidden'); content.style.display = 'none'; hideError(); }
function hideLoader() { loader.classList.add('hidden'); }
function showError(msg) { hideLoader(); errText.textContent = msg; errBox.classList.remove('hidden'); content.style.display = 'none'; }
function hideError() { errBox.classList.add('hidden'); }
