// =============================================
// PASTE YOUR NEW API KEY FROM weatherapi.com HERE
// =============================================
const API_KEY = '3671d171df0d421eaac94754262503';
// =============================================

let weatherData = {};
let isCelsius = true;

// Elements
const searchBtn = document.getElementById('search-btn');
const input = document.getElementById('location-input');
const loader = document.getElementById('loader');
const errorMsg = document.getElementById('error-msg');
const errorText = document.getElementById('error-text');
const weatherContent = document.getElementById('weather-content');
const toggleBtn = document.getElementById('toggle-unit');

// Search on button click or Enter key
searchBtn.addEventListener('click', fetchWeather);
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') fetchWeather();
});

// Toggle °C / °F
toggleBtn.addEventListener('click', () => {
    isCelsius = !isCelsius;
    if (Object.keys(weatherData).length > 0) updateTemperatureDisplay();
});

function fetchWeather() {
    const place = input.value.trim();
    if (!place) {
        showError('Please enter a city name.');
        return;
    }

    showLoader();

    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${place}&days=5&aqi=yes`)
        .then(response => {
            if (!response.ok) throw new Error('City not found');
            return response.json();
        })
        .then(data => {
            weatherData = data;
            isCelsius = true;
            toggleBtn.textContent = 'Switch to °F';
            showWeather();
        })
        .catch(err => {
            showError(err.message === 'City not found'
                ? 'City not found. Please check the spelling and try again.'
                : 'Something went wrong. Please try again later.');
        });
}

function showWeather() {
    hideLoader();
    hideError();
    weatherContent.style.display = 'block';

    const loc = weatherData.location;
    const cur = weatherData.current;

    document.getElementById('city-name').textContent = `${loc.name}, ${loc.country}`;
    document.getElementById('current-date').textContent = new Date(loc.localtime).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    document.getElementById('weather-icon').src = `https:${cur.condition.icon}`;
    document.getElementById('weather-icon').alt = cur.condition.text;
    document.getElementById('weather-description').textContent = cur.condition.text;
    document.getElementById('wind-speed').textContent = cur.wind_kph;
    document.getElementById('humidity').textContent = cur.humidity;
    document.getElementById('clouds').textContent = cur.cloud;
    document.getElementById('visibility').textContent = cur.vis_km;
    document.getElementById('uv-index').textContent = cur.uv;

    updateTemperatureDisplay();
    renderForecast();
}

function updateTemperatureDisplay() {
    const cur = weatherData.current;

    if (isCelsius) {
        document.getElementById('current-temp').textContent = Math.round(cur.temp_c);
        document.getElementById('unit-label').textContent = '°C';
        document.getElementById('feels-like').textContent = Math.round(cur.feelslike_c);
        document.getElementById('feels-unit').textContent = '°C';
        toggleBtn.textContent = 'Switch to °F';
    } else {
        document.getElementById('current-temp').textContent = Math.round(cur.temp_f);
        document.getElementById('unit-label').textContent = '°F';
        document.getElementById('feels-like').textContent = Math.round(cur.feelslike_f);
        document.getElementById('feels-unit').textContent = '°F';
        toggleBtn.textContent = 'Switch to °C';
    }

    renderForecast();
}

function renderForecast() {
    const forecastContainer = document.getElementById('forecast-days');
    forecastContainer.innerHTML = '';

    const days = weatherData.forecast.forecastday;

    days.forEach(day => {
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        const high = isCelsius ? Math.round(day.day.maxtemp_c) + '°C' : Math.round(day.day.maxtemp_f) + '°F';
        const low = isCelsius ? Math.round(day.day.mintemp_c) + '°C' : Math.round(day.day.mintemp_f) + '°F';

        const card = document.createElement('div');
        card.classList.add('forecast-day');
        card.innerHTML = `
            <p class="forecast-dayname">${dayName}</p>
            <p class="forecast-date">${dateStr}</p>
            <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">
            <p class="forecast-condition">${day.day.condition.text}</p>
            <div class="forecast-temp">
                <span class="high">${high}</span>
                <span class="low">${low}</span>
            </div>
            <div class="rain-chance">
                <i class="fas fa-umbrella"></i> ${day.day.daily_chance_of_rain}%
            </div>
        `;
        forecastContainer.appendChild(card);
    });
}

function showLoader() {
    loader.classList.remove('hidden');
    weatherContent.style.display = 'none';
    hideError();
}

function hideLoader() {
    loader.classList.add('hidden');
}

function showError(msg) {
    hideLoader();
    errorText.textContent = msg;
    errorMsg.classList.remove('hidden');
    weatherContent.style.display = 'none';
}

function hideError() {
    errorMsg.classList.add('hidden');
}
