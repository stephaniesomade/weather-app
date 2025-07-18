const backgroundMap = {
  Clear: 'linear-gradient(to right, #fbc2eb, #a6c1ee)',
  Clouds: 'linear-gradient(to right, #d7d2cc, #304352)',
  Rain: 'linear-gradient(to right, #4e54c8, #8f94fb)',
  Snow: 'linear-gradient(to right, #e0eafc, #cfdef3)',
  Thunderstorm: 'linear-gradient(to right, #0f0c29, #302b63, #24243e)',
  Drizzle: 'linear-gradient(to right, #74ebd5, #9face6)',
  Mist: 'linear-gradient(to right, #d7d2cc, #b0b0b0)',
  Fog: 'linear-gradient(to right, #d7d2cc, #b0b0b0)',
  Default: 'linear-gradient(to right, #8EC5FC, #E0C3FC)',
};

function setBackground(weather) {
  const body = document.body;
  const gradient = backgroundMap[weather] || backgroundMap.Default;
  body.style.background = gradient;
}

function convertUnixToTime(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}


function formatTimeWithAmPm(timestamp) {

  const getTime = convertUnixToTime(timestamp)
  const getHour = `${getTime[0]}${getTime[1]}`

  const getTimeStamp = getHour >= 12 ? 'PM' : 'AM';
  return `${getTime} ${getTimeStamp}`
}

async function getWeather() {
  const city = document.getElementById('cityInput').value;
  const apiKey = '503a7f59850d436323b5d49c4def4dbd';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('City not found');
    const data = await response.json();
    const windSpeedKmh = (data.wind.speed * 3.6 / 1.609).toFixed(1);
    const country = data.sys.country;
    setBackground(data.weather[0].main);

    console.log("stephanie this is the weather", data)


    document.getElementById('weatherResult').innerHTML = `
      <h2>${data.name}, ${data.sys.country}
        <img src="https://flagsapi.com/${country}/flat/32.png" alt="${country} flag" />
     </h2>
      <p><img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather icon" /></p>
      <p>${data.weather[0].main} - ${data.weather[0].description}</p>
      <p>Temp: ${data.main.temp}°C</p>
      <p>Feels Like: ${data.main.feels_like}°C</p>
      <p>Humidity: ${data.main.humidity}%</p>
      <p>Wind Speed: ${windSpeedKmh} miles per hour</p>
      <p>Sunrise: ${formatTimeWithAmPm(data.sys.sunrise)}</p>
      <p>Sunset: ${formatTimeWithAmPm(data.sys.sunset)}</p>
    `;

  } catch (error) {
    document.getElementById('weatherResult').innerHTML = `<p>⚠️ ${error.message}</p>`;
  }
}