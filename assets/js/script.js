const apiKey = `20ce73b0d2cf9b0de3d0d7e0943f1b10`
const baseURL = 'https://api.openweathermap.org/data/2.5'

function currentWeatherCity(city) {
    const query = `/weather?lat={lat}&lon={lon}&appid={API key}`
}

function fiveDay(city){
    const query = `/forecast?lat={lat}&lon={lon}&appid={API key}`
}