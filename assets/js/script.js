// Open Weather API URL and Key
const baseURL = 'https://api.openweathermap.org/data/2.5'
const apiKey = `20ce73b0d2cf9b0de3d0d7e0943f1b10`
const form = $('.form')
const submitBtn = $('#submit-btn')
const history = $('.history')
const saved = $('.saved p')
const cityText = $('.cityText')

// Grab empty array
function citiesArray() {
    const raw = localStorage.getItem('cities')
    const citiesArray = JSON.parse(raw) || []
    return citiesArray
}

// Fetch current weather
function getCurrentWeather(city) {
    const query = `/weather?q=${city}&appid=${apiKey}&units=imperial`
    const url = baseURL + query

    return $.get(url)
}

// Fetch five day/3 hour weather
function getFiveDay(city) {
    const query = `/forecast?q=${city}&appid=${apiKey}&units=imperial`
    const url = baseURL + query

    return $.get(url)
}

// Display current weather
function displayCurrentWeather(currentData) {
    const city = $('#city-name')
    const date = $('#date')
    const temp = $('#temp')
    const wind = $('#wind')
    const humid = $('#humidity')
    const icon = $('.icon')
    const formattedDate = dayjs().format('MMM D, YYYY hh:mm a')
    icon.empty()

    // Use use innertext to inject text into the exiting html elements, append theicon
    city.text(`${currentData.name}`)
    date.text(`${formattedDate}`)
    temp.text(`Tempurture: ${currentData.main.temp}° F`)
    wind.text(`Wind: ${currentData.wind.speed} mph`)
    humid.text(`Humidity: ${currentData.main.humidity}%`)
    icon.append(`<img class="day-thumbnail" src="https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png" alt="${currentData.weather[0].description}">`)
    return currentData.name
}

// Display five day weather
function displayFiveDay(forecastData) {
    const forecastDiv = $('#forecast-div')
    forecastDiv.empty()

    forecastData.list.forEach(function (fiveDayObj) {
        const date = dayjs(fiveDayObj.dt_txt).format('M/D/YYYY')

        if (fiveDayObj.dt_txt.includes('12:00')) {
            forecastDiv.append(`
            <div class="p-1 bg-info-subtle text-primary-emphasis rounded-1 shadow p-3 mb-2 bg-body-tertiary rounded">
                <h3>${date}</h3>
                <div class="d-flex justify-content-center">
                    <img class="mx-auto" src="https://openweathermap.org/img/wn/${fiveDayObj.weather[0].icon}@2x.png" alt="${fiveDayObj.weather[0].description}">
                </div>
                <p>Temp: ${fiveDayObj.main.temp}° F</p>
                <p>Wind: ${fiveDayObj.wind.speed} mph</p>
                <p>Humidity: ${fiveDayObj.main.humidity}%</p>
            </div>`)
        }
    })
}

// Start the current and five day display Process
function displaySearchedValue(searchedCity) {

    getCurrentWeather(searchedCity)
        .then(displayCurrentWeather)
        .then(getFiveDay)
        .then(displayFiveDay)
}

// Store input data to local storage
function formInput(e) {
    e.preventDefault()

    const cities = citiesArray()
    const cityInput = $('#city-input')
    const cityVal = cityInput.val()

    displaySearchedValue(cityVal)
    // Gheck to see if the input already exists in local storage and if its an empty string 
    if (!cities.some(cityObj => cityObj.city === cityVal) && cityVal !== '') {

        const savedCity = {
            city: cityVal
        }

        cities.push(savedCity)
        localStorage.setItem('cities', JSON.stringify(cities))
    }

    cityInput.val('')
}

// Creade divs ahta append to the history section
function renderCityHistory() {
    const cities = citiesArray()

    cities.forEach(function (cityObj) {
        if( isCityInHistory(cityObj.city)) {
            history.append(`
            <div class='saved'>
            <p class="history-btn py-1 border border-dark-subtle rounded-2 bg-primary text-white">${cityObj.city}</p>
            </div>
            `)
        }
    })
}

// Check to see if the city has already been rendered as a history item
function isCityInHistory(city) {
    const savedCities = $('.history-btn');
    for (let i = 0; i < savedCities.length; i++) {
        if (savedCities[i].textContent === city) {
            return false;
        }
    }
    return true;
}

// When the history divs are clicked it displays the weather for that city
function displayHistory(event) {
    // Extract the text of the element that is clicked
    const clickedCity = $(event.target).text().trim()

    const cities = citiesArray()

    const savedCity = cities.find(cityObj => cityObj.city === clickedCity)

    if (savedCity) {
        displaySearchedValue(savedCity.city)
    }
}

// History is rendered and event listeners on standby
$(document).ready(function () {
    renderCityHistory()
    $(document).on('click', '.saved p', displayHistory)
    submitBtn.on('click', formInput)
    submitBtn.on('click',renderCityHistory)

}) 