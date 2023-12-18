$(document).ready(function () {
    let searchedCities = JSON.parse(localStorage.getItem('searchedCities')) || [];

    updateSearchHistory(searchedCities);

    $('#search-form').submit(function (event) {
        event.preventDefault();
        const searchTerm = $('#search-input').val().trim();

        if (searchTerm === '') {
            return;
        }

        const apiKey = 'eafdda80329f2e71b6ade7fada05e2fc';
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=${apiKey}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                displayWeather(data);
                addCityToHistory(searchTerm);
                displayFiveDayForecast(searchTerm); // Fetch and display 5-day forecast
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
            });
    });

    function displayWeather(weatherData) {
        // Display current weather conditions
        const city = weatherData.name;
        const temperature = weatherData.main.temp;
        const humidity = weatherData.main.humidity;
        const windSpeed = weatherData.wind.speed;
        const iconCode = weatherData.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`;

        const currentDate = dayjs().format('MMMM D, YYYY');
        const weatherIcon = $('<img>').attr('src', iconUrl).attr('alt', 'Weather Icon');
        const weatherDetails = $('<div>')
            .append($('<p>').text(`City: ${city}`))
            .append($('<p>').text(`Date: ${currentDate}`))
            .append($('<p>').text(`Temperature: ${temperature}°C`))
            .append($('<p>').text(`Humidity: ${humidity}%`))
            .append($('<p>').text(`Wind Speed: ${windSpeed} m/s`));

        $('#today').empty().append(weatherIcon, weatherDetails);
    }

    function addCityToHistory(city) {
        // Add searched city to search history
        if (!searchedCities.includes(city)) {
            if (searchedCities.length >= 5) {
                searchedCities.pop();
            }
            searchedCities.unshift(city);
            localStorage.setItem('searchedCities', JSON.stringify(searchedCities));
            updateSearchHistory(searchedCities);
        }
    }

    function updateSearchHistory(cities) {
        // Update the search history UI
        $('#history').empty();
        cities.forEach(city => {
            const listItem = $('<button>')
                .addClass('list-group-item btn btn-primary mb-2')
                .text(city)
                .click(function () {
                    const city = $(this).text();
                    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

                    fetch(apiUrl)
                        .then(response => response.json())
                        .then(data => {
                            displayWeather(data);
                            displayFiveDayForecast(city); // Display 5-day forecast for selected city
                        })
                        .catch(error => {
                            console.error('Error fetching weather data:', error);
                        });
                });

            $('#history').append(listItem);
        });
    }

    function displayFiveDayForecast(cityName) {
        // Fetch and display 5-day forecast
        const apiKey = 'eafdda80329f2e71b6ade7fada05e2fc';
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const forecastData = data.list;
                $('#forecast').empty();

                // Display each day's forecast
                forecastData.forEach(dayForecast => {
                    const date = dayForecast.dt_txt.split(' ')[0];
                    const temperature = dayForecast.main.temp;
                    const humidity = dayForecast.main.humidity;
                    const iconCode = dayForecast.weather[0].icon;
                    const iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`;

                    // Append the forecast for each day to the #forecast element
                    $('#forecast').append(`
                        <div class="day-forecast">
                            <p>Date: ${date}</p>
                            <img src="${iconUrl}" alt="Weather Icon">
                            <p>Temperature: ${temperature}°C</p>
                            <p>Humidity: ${humidity}%</p>
                        </div>
                    `);
                });
            })
            .catch(error => {
                console.error('Error fetching forecast data:', error);
            });
    }
});
