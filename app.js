const apiKey = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key

function fetchWeather() {
    const city = document.getElementById('city').value;
    if (!city) return alert('Please enter a city name.');

    // Current Weather API Call
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => displayCurrentWeather(data))
        .catch(error => console.error('Error fetching weather:', error));

    // 5-day Forecast API Call
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => displayForecast(data))
        .catch(error => console.error('Error fetching forecast:', error));
}

function displayCurrentWeather(data) {
    const weatherDisplay = document.getElementById('weather-display');
    weatherDisplay.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Weather: ${data.weather[0].description}</p>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="weather icon">
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind: ${data.wind.speed} m/s</p>
    `;
}

function displayForecast(data) {
    const forecastDisplay = document.getElementById('forecast-display');
    forecastDisplay.innerHTML = data.list
        .filter((_, index) => index % 8 === 0) // 8 data points per day
        .map(day => `
            <div class="forecast-card">
                <p>${new Date(day.dt_txt).toLocaleDateString()}</p>
                <p>${day.main.temp}°C</p>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="weather icon">
                <p>${day.weather[0].description}</p>
            </div>
        `)
        .join('');
}
