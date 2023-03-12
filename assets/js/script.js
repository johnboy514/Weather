var icons = "http://openweathermap.org/img/wn/";
var searchCity = "";
var searchFor = $("#searchFor");
var previouslySearched = document.querySelector("#previousSearches");
var searchHistory = [];

var getWeather = function () {
    event.preventDefault();
    var forcastDailyApiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "&appid=65b573e8279b5d0210cf36d1cfe53247&units=imperial";
    fetch(forcastDailyApiUrl).then(function (response) {
        if (response.ok) {
        return response.json().then(function (response) {
            $("#temperature").html(response.main.temp + "\u00B0F");
            $("#windSpeed").html(response.wind.speed + "MPH");
            $("#humidityPercent").html(response.main.humidity + "%");
            var lat = response.coord.lat;
            var lon = response.coord.lon;
            getForecast(lat, lon);
            $("#cityName").html(response.name);
            var date = moment.unix(response.dt).format("MM/DD/YY");
            $("#currentDate").html(date);
            var icons = "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";
            $("#icons").attr("src", icons);
    });
    }else {
        alert("Enter a city name");    
    }
});
};

function renderHistory() {
  previouslySearched.innerHTML = "";
  for (var i = 0; i < searchHistory.length; i++) {
    var history = searchHistory[i];
    var li = document.createElement("li");
    li.setAttribute("data-index", i);
    var button = document.createElement("button");
    button.textContent = history;
    li.appendChild(button);
    previouslySearched.appendChild(li);
  }
}

function init() {
  var storedHistory = JSON.parse(localStorage.getItem("searchHistory"));
  if (storedHistory !== null) {
    searchHistory = storedHistory;
  }
  renderHistory();
}

function storeHistory() {
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

previouslySearched.addEventListener("click", function(event) {
  var element = event.target;
  if (element.matches("button") === true) {
    var index = element.parentElement.getAttribute("data-index");
    searchCity = searchHistory[index];
    getWeather();
    storeHistory();
    renderHistory();
  }
});

init();

$(searchFor).on("submit", function (event) {
  event.preventDefault();
   searchCity = $("#searchCity").val().trim();
    getWeather();
    if (searchHistory.length > 9) {
      searchHistory.pop();
    }

    if (searchCity === "" || searchHistory.includes(searchCity)) {
    return;
  } else {

  searchHistory.unshift(searchCity);
  searchCity = "";
    storeHistory();
    renderHistory();
  }
  });

var getForecast = function (lat, lon) {
  var weeklyWeatherApiUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=65b573e8279b5d0210cf36d1cfe53247&units=imperial";
    fetch(weeklyWeatherApiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (response) {
        for(var i = 0; i < 33; i+=8) {
        var fetchCurrentDay = response.list[i].dt;
        var currentDay = moment.unix(fetchCurrentDay).format("MM/DD/YYYY");
          $("#date" + [i]).html(currentDay);
        var temperature = response.list[i].main.temp;
          $("#temp" + [i]).html(temperature + "\u00B0F");
        var windSpeed = response.list[i].wind.speed;
          $("#wind" + [i]).html(windSpeed + "MPH");  
        var humidityPercent = response.list[i].main.humidity;
          $("#humidity" + [i]).html(humidityPercent + "%");
        var weatherIcon = "http://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png";
          $("#icons" + [i]).attr("src", weatherIcon);
}});
  };