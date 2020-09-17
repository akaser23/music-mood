var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city-name");
var weatherContainerEl = document.querySelector("#weather-container");
var citySearchTerm = document.querySelector("#city-search-term");
var tempEl = document.querySelector("#temp");
var humidityEl = document.querySelector("#humidity");
var windEl = document.querySelector("#wind");
var uvIndexEl = document.querySelector("#uv");
var playlistEl = document.querySelector('#playlist-container');
var liquorType = "";
var cocktailName = document.querySelector("#cocktail-name");
var cocktailImg = document.querySelector("#cocktail-thumb");

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

var getCocktail = function () {

    fetch("https://www.thecocktaildb.com/api/json/v1/1/filter.php?i="
    + liquorType )
        .then(function(response) {
            if (response.ok) {
                response.json().then (function (data) {
                    console.log(data);
                    displayCocktail(data);
                })
            }
        })
};

var getInstructions = function(drinkId) {

    fetch("https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i="
    + drinkId )
        .then(function(response) {
            if (response.ok) {
                response.json().then (function (data) {
                    console.log(data);
                    displayDetail(data);
                })
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

    tempEl.innerHTML = Math.round((weather.main.temp - 273.15) * (9 / 5) + 32) + "&deg; F";

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

var displayPlaylist = function (weather) {

    console.log(weather.weather[0].main);

    if (weather.weather[0].main === "Clouds") {
        playlistEl.innerHTML = '<iframe class="spotify" src="https://open.spotify.com/embed/playlist/0gkNFS5NKEO32illt0eyeF" frameborder="0" id="music-player" allowtransparency="true" allow="encrypted-media"></iframe>';
        liquorType = "Scotch";
    }
    else if (weather.weather[0].main === "Thunderstorm") {
        playlistEl.innerHTML = '<iframe class="spotify" src="https://open.spotify.com/embed/playlist/0bQLlEp1rwCO06qzmuBsBN" frameborder="0" id="music-player" allowtransparency="true" allow="encrypted-media"></iframe>';
        liquorType = "Bourbon";
    }
    else if (weather.weather[0].main === "Drizzle") {
        playlistEl.innerHTML = '<iframe class="spotify" src="https://open.spotify.com/embed/playlist/0tjLWaFVAVegrqTXyqrhSD" frameborder="0" id="music-player" allowtransparency="true" allow="encrypted-media"></iframe>';
        liquorType = "Vodka";
    }
    else if (weather.weather[0].main === "Rain") {
        playlistEl.innerHTML = '<iframe class="spotify" src="https://open.spotify.com/embed/playlist/3LndYn1dDYsphyFzTXbc0g" frameborder="0" id="music-player" allowtransparency="true" allow="encrypted-media"></iframe>';
        liquorType = "Rye Whiskey";
    }
    else if (weather.weather[0].main === "Snow") {
        playlistEl.innerHTML = '<iframe class="spotify" src="https://open.spotify.com/embed/playlist/4PH4kPc5WhaKH9kuuoJaqw" frameborder="0" id="music-player" allowtransparency="true" allow="encrypted-media"></iframe>';
        liquorType = "Rum";
    }
    else if (weather.weather[0].icon === "50d") {
        playlistEl.innerHTML = '<iframe class="spotify" src="https://open.spotify.com/embed/playlist/4115GWyiQncaTuQmtDNefr" frameborder="0" id="music-player" allowtransparency="true" allow="encrypted-media"></iframe>';
        liquorType = "Tequila";
    }
    else if (weather.weather[0].icon === "50n") {
        playlistEl.innerHTML = '<iframe class="spotify" src="https://open.spotify.com/embed/playlist/4115GWyiQncaTuQmtDNefr" frameborder="0" id="music-player" allowtransparency="true" allow="encrypted-media"></iframe>';
        liquorType = "Tequila";
    }
    else if (weather.weather[0].main === "Clear") {
        playlistEl.innerHTML = '<iframe class="spotify" src="https://open.spotify.com/embed/playlist/37i9dQZF1DX1BzILRveYHb" frameborder="0" id="music-player" allowtransparency="true" allow="encrypted-media"></iframe>';
        liquorType = "Gin";
    }

    getCocktail();
};

var displayCocktail = function (cocktails) {

    var i = Math.floor(Math.random() * cocktails.drinks.length);

    cocktailName.innerHTML = cocktails.drinks[i].strDrink;

    var drinkImgUrl = cocktails.drinks[i].strDrinkThumb;
   
    $('#cocktail-thumb').attr('src', drinkImgUrl + "/preview");

    getInstructions(cocktails.drinks[i].idDrink);
};

var displayDetail = function (detail) {
    
    $("#ingredients1").html(detail.drinks[0].strMeasure1);
    $("#ingredients21").html(detail.drinks[0].strIngredient1);
    $("#ingredients2").html(detail.drinks[0].strMeasure2);
    $("#ingredients22").html(detail.drinks[0].strIngredient2);
    $("#ingredients3").html(detail.drinks[0].strMeasure3);
    $("#ingredients23").html(detail.drinks[0].strIngredient3);
    $("#ingredients4").html(detail.drinks[0].strMeasure4);
    $("#ingredients24").html(detail.drinks[0].strIngredient4);
    $("#ingredients5").text(detail.drinks[0].strMeasure5);
    $("#ingredients25").html(detail.drinks[0].strIngredient5);
    $("#ingredients6").text(detail.drinks[0].strMeasure6);
    $("#ingredients26").html(detail.drinks[0].strIngredient6);
    $("#ingredients7").html(detail.drinks[0].strMeasure7);
    $("#ingredients27").html(detail.drinks[0].strIngredient7);
    $("#ingredients8").html(detail.drinks[0].strMeasure8);
    $("#ingredients28").html(detail.drinks[0].strIngredient8);
    $("#ingredients9").html(detail.drinks[0].strMeasure9);
    $("#ingredients29").html(detail.drinks[0].strIngredient9);
    $("#ingredients10").html(detail.drinks[0].strMeasure10);
    $("#ingredients210").html(detail.drinks[0].strIngredient10);
    $("#ingredients11").html(detail.drinks[0].strMeasure11);
    $("#ingredients211").html(detail.drinks[0].strIngredient11);
    $("#ingredients12").html(detail.drinks[0].strMeasure12);
    $("#ingredients212").html(detail.drinks[0].strIngredient12);
    $("#ingredients13").html(detail.drinks[0].strMeasure13);
    $("#ingredients213").html(detail.drinks[0].strIngredient13);
    $("#ingredients14").text(detail.drinks[0].strMeasure14);
    $("#ingredients214").html(detail.drinks[0].strIngredient14);
    $("#ingredients15").html(detail.drinks[0].strMeasure15);
    $("ingredients215").html(detail.drinks[0].strIngredient15);

    $("#instructions").html(detail.drinks[0].strInstructions);

}


cityFormEl.addEventListener("submit", formSubmitHandler);