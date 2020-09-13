var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city-name");
var weatherContainerEl = document.querySelector("#weather-container");
var citySearchTerm = document.querySelector("#city-search-term");
var tempEl = document.querySelector("#temp");
var humidityEl = document.querySelector("#humidity");
var windEl = document.querySelector("#wind");
var uvIndexEl = document.querySelector("#uv");
var playlistEl = document.querySelector('#playlist-container');

var getCityWeather = function (city) {
    //format the github api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=c0acf9a2d1becd72a92787658f4ca1e7"

    //make request to the url
    fetch(apiUrl)
        .then(function (response) {
            //request was successful
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    displayWeather(data);
                    displayPlaylist(data);

                    var lat = data.coord.lat;
                    var lon = data.coord.lon;

                    fetch("https://api.openweathermap.org/data/2.5/uvi?appid=c0acf9a2d1becd72a92787658f4ca1e7&lat="
                        + lat
                        + "&lon="
                        + lon)
                        .then(function (response) {
                            if (response.ok) {
                                response.json().then(function (data) {
                                    // console.log(data);
                                    displayUv(data.value);
                                })
                            }
                        });
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
};

var formSubmitHandler = function (event) {
    event.preventDefault();

    var cityName = cityInputEl.value.trim();

    if (cityName) {
        getCityWeather(cityName);
        cityInputEl.value = "";
    } else {
        alert("Please enter a city name.");
    }

    $(weatherContainerEl).removeClass("hide");
};

var displayWeather = function (weather) {
    citySearchTerm.innerHTML = weather.name + " " + moment().format("MM[/]DD[/]YYYY");

    var iconcode = weather.weather[0].icon;
    var iconUrl = "http://openweathermap.org/img/w/" + iconcode + ".png";
    $('#icon').attr('src', iconUrl);

    tempEl.innerHTML = Math.round((weather.main.temp - 273.15) * (9/5) + 32) + "&deg; F";

    humidityEl.innerHTML = weather.main.humidity + "%";

    windEl.innerHTML = weather.wind.speed + " MPH";
};

var displayUv = function (uvIndex) {

    uvIndexEl.innerHTML = uvIndex;
    $(uvIndexEl).removeClass("low").removeClass("moderate").removeClass("high");

    if (uvIndex < 4) {
        $(uvIndexEl).addClass("low");
    }
    else if (uvIndex < 8 && uvIndex > 4) {
        $(uvIndexEl).addClass("moderate"); 
    }
    else {
        $(uvIndexEl).addClass("high");  
    }

};

cityFormEl.addEventListener("submit",formSubmitHandler);


var displayPlaylist = function (weather) {

    console.log(weather.weather[0].main);

    if (weather.weather[0].main === "Clouds") {
        playlistEl.innerHTML = '<iframe id="myFrame" src="https://open.spotify.com/embed/playlist/0gkNFS5NKEO32illt0eyeF" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>';
    }
    else if (weather.weather[0].main === "Thunderstorm") {
        playlistEl.innerHTML = '<iframe id="myFrame" src="https://open.spotify.com/embed/playlist/0bQLlEp1rwCO06qzmuBsBN" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>';
    }
    else if (weather.weather[0].main === "Drizzle") {
        playlistEl.innerHTML = '<iframe id="myFrame" src="https://open.spotify.com/embed/playlist/0tjLWaFVAVegrqTXyqrhSD" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>';
    }
    else if (weather.weather[0].main === "Rain") {
        playlistEl.innerHTML = '<iframe id="myFrame" src="https://open.spotify.com/embed/playlist/3LndYn1dDYsphyFzTXbc0g" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>';
    }
    else if (weather.weather[0].main === "Snow") {
        playlistEl.innerHTML = '<iframe id="myFrame" src="https://open.spotify.com/embed/playlist/4PH4kPc5WhaKH9kuuoJaqw" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>';
    }
    else if (weather.weather[0].icon === "50d") {
        playlistEl.innerHTML = '<iframe id="myFrame" src="https://open.spotify.com/embed/playlist/4115GWyiQncaTuQmtDNefr" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>';
    }
    else if (weather.weather[0].main === "Clear") {
        playlistEl.innerHTML = '<iframe id="myFrame" src="https://open.spotify.com/embed/playlist/37i9dQZF1DX1BzILRveYHb" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>';
    }
};

cityFormEl.addEventListener("submit",formSubmitHandler);

var token = function(){
    fetch("https://accounts.spotify.com/api/token", {
  "method": "POST",
  "headers": {
    "cookie": "__Host-device_id=AQBVARAj99vGL1xWEm25t5EbApEo-fIC_0HPVNTkn-4VLfGI-S0mxY3IbbCRrNCfp1FadLOxc--cYGDAdbu6Q_CUhECsyGyHxYU",
    "authorization": "Basic MmI0MGNjYjZmYTRlNDRlMDg1M2VmNzhjODIxOWUxYTQ6OTk2MjE0NDk3YjZiNDE3OTlkOTQyMGZjZDIyZjczZjc=",
    "content-type": "application/x-www-form-urlencoded"
  },
  "body": {
    "grant_type": "client_credentials"
  }
})
.then(response => {
  console.log(response);
})
.catch(err => {
  console.error(err);
});
};

var getArtist = fetch(`https://api.spotify.com/v1/search?q=imaginedragons&type=artist`, {
//var getArtist = fetch(`https://api.spotify.com/v1/search?q=${artist}&type=artist`, {
  "method": "GET",
  "headers": {
    "authorization": "Bearer " + token.access_token
  }
})
.then(response => {
  console.log(response);
})
.catch(err => {
  console.error(err);
});
