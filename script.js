const apiKey = "6f6547fe1c0a29cbb1bde024bf448296"
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}`

const content = document.querySelectorAll(".grid-item")
const home = document.getElementById("home")
const searchbar = document.getElementById("search-bar")
const search = document.getElementById("search-button")
const city = document.getElementById("city-name")
const time = document.getElementById("time")
const date = document.getElementById("date")
const timezone = document.getElementById("timezone")
const temp = document.getElementById("temp")
const deg = document.getElementsByClassName("deg")
const mintemp = document.getElementById("min-temp")
const maxtemp = document.getElementById("max-temp")
const description = document.getElementById("weather-description")
const sunrise = document.getElementById("sunrise")
const sunset = document.getElementById("sunset")
const weathericon = document.getElementById("weather-icon")
const latitude = document.getElementById("latitude")
const longitude = document.getElementById("longitude")
const map = document.getElementById("section2")
const pressure = document.getElementById("pressure")
const grndpress = document.getElementById("grnd-pressure")
const windspeed = document.getElementById("wind-speed")
const direction = document.getElementById("direction")
const directionicon = document.getElementById("direction-icon")
const humidity = document.getElementById("humidity")
const visibility = document.getElementById("visibility")
const clouds = document.getElementById("clouds")
const raintime = document.getElementById("rain-time")
const rain = document.getElementById("rain")

function addmap(name) {
    let newmap = `<iframe id="map" src="https://maps.google.com/maps?q=${name}&hl=en&z=14&amp;output=embed" allowfullscreen=""
                    loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
    map.lastElementChild.remove()
    map.insertAdjacentHTML("beforeend", newmap)
}

let IconSrc = {
    "01d": "icons/day-clear.svg",
    "02d": "icons/day-cloudy.svg",
    "03d": "icons/cloud-2.svg",
    "04d": "icons/cloudy.svg",
    "09d": "icons/showers.svg",
    "10d": "icons/day-showers.svg",
    "11d": "icons/day-storm-showers.svg",
    "13d": "icons/day-snow.svg",
    "50d": "icons/mist.svg",
    "01n": "icons/night-clear.svg",
    "02n": "icons/night-cloudy.svg",
    "03n": "icons/cloud-2.svg",
    "04n": "icons/cloudy.svg",
    "09n": "icons/showers.svg",
    "10n": "icons/night-showers.svg",
    "11n": "icons/night-storm-showers.svg",
    "13n": "icons/night-snow.svg",
    "50n": "icons/mist.svg"
}

function getDirection(direction) {
    if (direction >= 337.5 && direction < 22.5) return "North"
    else if (direction >= 22.5 && direction < 67.5) return "North East"
    else if (direction >= 67.5 && direction < 112.5) return "East"
    else if (direction >= 112.5 && direction < 157.5) return "South East"
    else if (direction >= 157.5 && direction < 202.5) return "South"
    else if (direction >= 202.5 && direction < 247.5) return "South West"
    else if (direction >= 247.5 && direction < 292.5) return "West"
    else if (direction >= 292.5 && direction < 337.5) return "North West"
}

function convertTime(timestamp) {
    let dateObj = new Date(timestamp * 1000);
    let utcString = dateObj.toUTCString();
    return utcString
}

function getTime(time, timeZone) {
    let timezoneArr = timeZone.split(":")
    let timeArr = time.split(":")
    let realTimeArr = []
    realTimeArr[0] = Number(timeArr[0]) + Number(timezoneArr[0])
    realTimeArr[1] = ":"
    realTimeArr[2] = Number(timeArr[1]) + Number(timezoneArr[1])
    if (realTimeArr[2] >= 60) {
        realTimeArr[2] = realTimeArr[2] - 60
        realTimeArr[0] = realTimeArr[0] + 1
    }
    let div = Math.floor(realTimeArr[0] / 12)
    realTimeArr[0] = realTimeArr[0] % 12
    realTimeArr[3] = (div % 2 == 0) ? " AM" : " PM"
    return realTimeArr.join("")
}

function getTimeZone(timezone) {
    timezone = (timezone / 3600).toFixed(2).toString().split(".")
    if (timezone[0].charAt(0) == "-") return timezone[0] + ":" + (60 * timezone[1] / 100)
    else return "+" + timezone[0] + ":" + (60 * timezone[1] / 100)
}

async function getWeather() {
    let city = searchbar.value
    let weatherData = await fetch(apiUrl + "&q=" + city + "&units=metric")
    return weatherData
}


function hide(cod = "Enter Your City", message = "") {
    content.forEach(element => {
        element.classList.add("display-none")
    });
    home.classList.remove("display-none")
    home.textContent = cod + " \n " + message
}

function show() {
    content.forEach(element => {
        element.classList.remove("display-none")
    });
    home.classList.add("display-none")
}

function searchweather() {
    getWeather().then((resolve) => {
        return resolve.json()
    }).then((data) => {
        if (data.cod > 400) {
            console.log(data)
            hide(data.cod, data.message)
        }
        else {
            city.textContent = data.name
            let timeZone = getTimeZone(data.timezone)
            let convertedTime = convertTime(data.dt)
            time.textContent = getTime(convertedTime.slice(16, 22), timeZone)
            date.textContent = convertedTime.slice(0, 12)
            timezone.textContent = timeZone
            temp.textContent = Math.floor(data.main.temp)
            mintemp.textContent = Math.floor(data.main.temp_min)
            maxtemp.textContent = Math.floor(data.main.temp_max)
            let des = data.weather[0].description
            description.textContent = des.charAt(0).toUpperCase() + des.slice(1)
            sunrise.textContent = getTime(convertTime(data.sys.sunrise).slice(16, 22), timeZone)
            sunset.textContent = getTime(convertTime(data.sys.sunset).slice(16, 22), timeZone)
            weathericon.src = IconSrc[data.weather[0].icon]
            latitude.textContent = data.coord.lat
            longitude.textContent = data.coord.lon
            addmap(data.name)
            pressure.textContent = data.main.pressure
            grndpress.textContent = data.main.grnd_level
            windspeed.textContent = (data.wind.speed * 3.6).toFixed(1)
            direction.textContent = getDirection(data.wind.deg)
            directionicon.style.transform = `rotate(${data.wind.deg}deg)`
            humidity.textContent = data.main.humidity
            visibility.textContent = (data.visibility / 1000).toFixed(1)
            clouds.textContent = data.clouds.all
            if (data.rain == undefined) {
                raintime.textContent = "N/A"
                rain.textContent = "N/A"
            } else {
                for (const key in data.rain) {
                    raintime = key.slice(0, 1) + " " + key.slice(1)
                    rain = data.rain[key]
                }
            }
            show()
        }
    })
}

hide()
search.addEventListener("click", () => {
    searchweather()
})
searchbar.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchweather()
    }
})