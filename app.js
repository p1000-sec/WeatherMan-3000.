const apiKey = '';
const newsApiKey = '';
let cities = [];

function fetchWeather() {
    const city = document.getElementById('city').value;
    if (!city) return alert('Please enter a city name.');

    cities.push(city);
    updateCitySelector();

    // Current Weather API Call
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
            setWeatherBackground(data.weather[0].main);
        })
        .catch(error => console.error('Error fetching weather:', error));
}

function updateCitySelector() {
    const selector = document.getElementById('city-selector');
    selector.innerHTML = `<option value="">Previous Cities</option>` +
                         cities.map(city => `<option value="${city}">${city}</option>`).join('');
}

function switchCity() {
    const selectedCity = document.getElementById('city-selector').value;
    if (selectedCity) {
        document.getElementById('city').value = selectedCity;
        fetchWeather();
    }
}

function setWeatherBackground(weatherType) {
    const weatherApp = document.getElementById('weatherApp');
    weatherApp.className = "weather-app"; // Reset class
    if (weatherType.toLowerCase().includes("cloud")) {
        weatherApp.classList.add("cloudy");
    } else if (weatherType.toLowerCase().includes("rain")) {
        weatherApp.classList.add("rainy");
    } else if (weatherType.toLowerCase().includes("snow")) {
        weatherApp.classList.add("snowy");
    } else {
        weatherApp.classList.add("sunny");
    }
}

function fetchForecast(days) {
    const city = document.getElementById('city').value;
    if (!city) return alert('Please enter a city name.');

    // Adjust forecast API for different day ranges
    const forecastAPI = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    
    fetch(forecastAPI)
        .then(response => response.json())
        .then(data => displayForecast(data, days))
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

function displayForecast(data, days) {
    const forecastDisplay = document.getElementById('forecast-display');
    const filteredData = data.list.filter((_, index) => index % 8 === 0); // Roughly once per day

    forecastDisplay.innerHTML = filteredData.slice(0, days).map(day => `
        <div class="forecast-card">
            <p>${new Date(day.dt_txt).toLocaleDateString()}</p>
            <p>${day.main.temp}°C</p>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="weather icon">
            <p>${day.weather[0].description}</p>
        </div>
    `).join('');
}

function fetchNews(city) {
    // News API Call (replace with your actual endpoint if using a different API)
    fetch(`https://newsapi.org/v2/everything?q=weather ${city}&apiKey=${newsApiKey}`)
        .then(response => response.json())
        .then(data => displayNews(data.articles))
        .catch(error => console.error('Error fetching news:', error));
}

function displayNews(articles) {
    const newsDisplay = document.getElementById('news-articles');
    newsDisplay.innerHTML = articles
        .slice(0, 5) // Display top 5 news articles
        .map(article => `
            <div class="news-card">
                <h3>${article.title}</h3>
                <p>${article.description || 'No description available.'}</p>
                <a href="${article.url}" target="_blank">Read more</a>
            </div>
        `)
        .join('');
}
