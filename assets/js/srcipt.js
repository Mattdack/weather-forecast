var geoURL = "http://api.openweathermap.org/geo/1.0/direct?q="
var weatherURL = "https://api.openweathermap.org/data/2.5/forecast?lat=";

var inputEl = $('#city-input');
var searchEl = $('#search-Btn');
var dayOfEl = $('#day-of');
var fiveDayEl = $('#five-day');
var cityLat;
var cityLon;
// User enters in city name and clicks search or presses enter
// Acquire latitude and longitude data associated with that city and store

function getLatLong() {
    var cityName = inputEl.val();
    var cityNameEl = $('<h2>').text(cityName + " (" + moment().format("MM/DD/YY") + ")");
    dayOfEl.append(cityNameEl);
    fetch(geoURL + cityName + '&limit=1&appid=ad135c2d1b0c4e73e98dbe91d4187ad4')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.length > 0) {
                cityLat = data[0].lat;
                cityLon = data[0].lon;
                console.log(cityLat);
                return getWeatherData();
            } else {
                alert("You did not enter a valid city name. Please re-enter.")
            }
        })
}
// Pass the latitude and longitude to the API fetch as parameters and acquire date, weather icon, temperature, wind, and humidity 
function getWeatherData () {
    fetch(weatherURL + cityLat + "&lon=" + cityLon + "&appid=ad135c2d1b0c4e73e98dbe91d4187ad4" )
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        var temp = ((9/5)*(data.list[0].main.temp - 273) + 32).toFixed(1);
        var date = moment(data.list[0].clouds.dt).format("MM/DD/YY");
        var wind = data.list[0].wind.speed;
        var humidity = data.list[0].main.humidity;
        var icon = data.list[0].weather[0].icon;

        var tempEl = $('<p>').text("Temp: " + temp + " F");
        var dateEl = $('<p>').text(date);
        var windEl = $('<p>').text("Wind: " + wind + " MPH");
        var humidityEl = $('<p>').text("Humidity: " + humidity + " %");
        var iconEl = $('<img>').attr("src", 'http://openweathermap.org/img/w/' + icon + '.png')
        dayOfEl.append(iconEl, tempEl, windEl, humidityEl);
    })
}
// Create a button with the name of the city and append to the past city search section. Selecting that button loads the day of and 5 day forecast for that city.

// Update the day of weather section
// Loop through the 5 day forecast creating cards and appending to the five-day forcast section.

searchEl.on("click", getLatLong);