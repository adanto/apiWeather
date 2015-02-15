// Cuando se cargue este archivo se autogenerará la función que se ha definido 'entre parentesis'
(function() {

	var API_WORLDTIME_KEY = 'aff19ba8734c2a9c4641ba2779a00';
	var API_WORLDTIME = 'http://api.worldweatheronline.com/free/v2/tz.ashx?format=json&key='+API_WORLDTIME_KEY+'&q=';
	var API_WEATHER_KEY = 'e8d148c6205c5cb3e3c717f53136b299';
	var API_WEATHER_URL = 'http://api.openweathermap.org/data/2.5/weather?';
	var IMG_WEATHER = 'http://openweathermap.org/img/w/';
	var today = new Date();
	var timeNow = today.toLocaleTimeString();

	var $body = $('body');
	var $loader = $('.loader');
	var nuevaCiudad = $('[data-input="cityAdd"]');
	var buttonAdd = $('[data-button="add"]');
	var buttonLoad = $('[data-saved-cities]');

	var cities = [];
	var cityWeather = {};
	cityWeather.zone;
	cityWeather.icon;
	cityWeather.temp;
	cityWeather.temp_max;
	cityWeather.temp_min;
	cityWeather.main;

	$( buttonLoad ).on('click', loadSavedCities);
	$( buttonAdd ).on('click', addNewCity);
	$( nuevaCiudad ).on('keypress', function(event) {
		if(event.which == 13) { // Intro en el campo de input
			addNewCity(event);
		}
	});

	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(getCoord, errorFound);
	} else {
		alert('Por favor actualiza tu navegador');
	}

	function errorFound(err) {
		alert('Un error ocurrido: '+err.code);
		//0: Error desconocido
		//1: Permiso denegado
		//2: Posición no disponible
		//3: Timeout
	};

	function getCoord(position) {
		var lat = position.coords.latitude;
		var lon = position.coords.longitude;
		console.log('Tu posición es: '+lat + ', '+lon);
		//api.openweathermap.org/data/2.5/weather?lat=35&lon=139
		$.getJSON(API_WEATHER_URL+'lat='+lat+'&lon='+lon, getCurrentWeather);
	};

	function getCurrentWeather(data) {
		cityWeather.zone = data.name;
		cityWeather.icon = IMG_WEATHER +data.weather[0].icon+'.png';
		cityWeather.temp = data.main.temp - 273.15;
		cityWeather.temp_max = data.main.temp_max - 273.15;
		cityWeather.temp_min = data.main.temp_min - 273.15;
		cityWeather.main = data.weather[0].main;

		renderTemplate(cityWeather);

	};

	function activateTemplate(id) {
		var t = document.querySelector(id);
		return document.importNode(t.content, true);
	};

	function renderTemplate(cityWeather, localtime) {


		var clone = activateTemplate('#template--city');
		var timeToShow;
		if(localtime) {
			timeToShow = localtime.split(" ")[1];
		} else {
			timeToShow = timeNow;
		}

		clone.querySelector('[data-time]').innerHTML = timeToShow;
		clone.querySelector('[data-city]').innerHTML = cityWeather.zone;
		clone.querySelector('[data-icon]').src = cityWeather.icon;
		clone.querySelector('[data-temp="max"]').innerHTML = cityWeather.temp_max.toFixed(1);
		clone.querySelector('[data-temp="min"]').innerHTML = cityWeather.temp_min.toFixed(1);
		clone.querySelector('[data-temp="current"]').innerHTML = cityWeather.temp.toFixed(1);

		$( $loader ).hide();
		$( $body ).append(clone);
	};

	function addNewCity(event) {
		// Evitmaos que recarge por defecto al pulsar el botón
		event.preventDefault();
		$.getJSON(API_WEATHER_URL + 'q=' + $( nuevaCiudad ).val(), getWeatherNewCity);

	}

	function getWeatherNewCity(data) {

		$.getJSON(API_WORLDTIME + $( nuevaCiudad ).val(), function(res) {
			//Para que se borre el input después de realizar la llamada AJAX
			$(nuevaCiudad).val("");

			cityWeather = {};
			cityWeather.zone = data.name;
			cityWeather.icon = IMG_WEATHER + data.weather[0].icon + '.png';
			cityWeather.temp = data.main.temp - 273.15;
			cityWeather.temp_max = data.main.temp_max - 273.15;
			cityWeather.temp_min = data.main.temp_min - 273.15;

			renderTemplate(cityWeather, res.data.time_zone[0].localtime);

			cities.push(cityWeather);
			localStorage.setItem('cities', JSON.stringify(cities));
		});
	}

	function loadSavedCities(event) {
		event.preventDefault();

		function renderCities(cities) {
			cities.forEach(function(city) {
				renderTemplate(city);
			});
		};

		cities = JSON.parse( localStorage.getItem('cities') );
		renderCities(cities);
	}

})();