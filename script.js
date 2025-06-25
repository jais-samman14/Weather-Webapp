let weatherData = {};

const btn = document.getElementById('search-btn');
btn.addEventListener('click',() =>{
    const place = document.getElementById('location-input').value.trim();
    if (place === "") {
        alert("Please enter a location.");
        return;
    }
    fetch(`http://api.weatherapi.com/v1/current.json?key=42a81912e57e467da9863411251606&q=${place}&aqi=yes`)
    .then(response => response.json())
    .then((data) => {
        weatherData = data;
        showdata();
    })
    .catch(error => console.log('Error :',error));

});

function showdata(){

    const city = document.getElementById('city-name');
    const temp = document.getElementById('current-temp');
    const description = document.getElementById('weather-description');
    const windSpeed = document.getElementById('wind-speed');
    const humidity = document.getElementById('humidity');
    const cloud = document.getElementById('clouds');
    const weatherIcon = document.getElementById('weather-icon');
    const currentDate = document.getElementById('current-date');

    city.textContent = `${weatherData.location.name}, ${weatherData.location.country}`;

    currentDate.textContent = new Date(weatherData.location.localtime).toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    temp.textContent = weatherData.current.temp_c;
    description.textContent = weatherData.current.condition.text;
    windSpeed.textContent = weatherData.current.wind_kph;
    humidity.textContent = weatherData.current.humidity;
    cloud.textContent = weatherData.current.cloud;
    
    weatherIcon.src = `https:${weatherData.current.condition.icon}`;
    weatherIcon.alt = weatherData.current.condition.text;
    

}