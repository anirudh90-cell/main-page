window.onload = function() {
    if (navigator.permissions) {
        navigator.permissions.query({ name: 'geolocation' }).then(function(permissionStatus) {
            if (permissionStatus.state === 'granted') {
                navigator.geolocation.getCurrentPosition(showWeather, showError);
            } else if (permissionStatus.state === 'prompt') {
                navigator.geolocation.getCurrentPosition(showWeather, showError);
            } else {
                document.getElementById('weather').textContent = "Location access has been denied. Please enable location services and refresh the page.";
            }
        });
    } else {
        document.getElementById('weather').textContent = "Permissions API not supported.";
    }
};

function showWeather(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const apiKey = 'd14a944671284d4abdf124056242907';
    const weatherUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`;

    fetch(weatherUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const weather = data.current.condition.text;
            const temp = data.current.temp_c;
            document.getElementById('weather').innerHTML = `Weather: ${weather}, Temperature: ${temp}°C`;
        })
        .catch(error => {
            document.getElementById('weather').textContent = "Unable to fetch weather data.";
            console.error('Error fetching data:', error);
        });
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            document.getElementById('weather').textContent = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            document.getElementById('weather').textContent = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            document.getElementById('weather').textContent = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            document.getElementById('weather').textContent = "An unknown error occurred.";
            break;
    }
}