import { useState, useEffect } from 'react'
import axios from 'axios'

const countryApiUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'
const weatherAPIUrl = 'https://api.openweathermap.org/data/2.5/weather?'
const APIkey = import.meta.env.VITE_API_KEY

const apiCall = (urlString) => {
    return axios.get(urlString)
}

const InputField = ({label, value, handler}) =>{
  return(
    <>
      {label}<input value={value} onChange={handler}/>
    </>
  )
}

const CountryName = ({country, showHandler}) =>{
    return(
        <>
            {country.name.common} 
            <button onClick={() => showHandler(country)}>show</button>
            <br/>
        </>
    )
}

const WeatherSection = ({country, weatherInfo}) => {
    if(weatherInfo){
        const iconCode = weatherInfo.weather[0].icon
        const altText = weatherInfo.weather[0].description
        return(
            <>
                <h3>Weather in {country.capital[0]}</h3>
                <p>Temperature is: {weatherInfo.main.temp - 273.15} celcius</p>
                <img src={`https://openweathermap.org/img/wn/${iconCode}@2x.png`} alt={altText}></img>
                <p>Wind is: {weatherInfo.wind.speed} m/s</p>
            </>
        )
    }
    return null
}

const CountryInfo = ({country}) => {
    const flagsrc = country.flags.png
    const flagalt = country.flags.alt

    const[weatherInfo, setWeatherInfo] = useState(null)

    useEffect(()=>{
        const apiCommand = `q=${country.capital[0]}&appid=${APIkey}`
        apiCall(`${weatherAPIUrl}${apiCommand}`)
        .then((res) => {
            setWeatherInfo(res.data)
        })
    },[])

    return(
        <>
            <h1>{country.name.common}</h1>
            <p>Capital: {country.capital[0]}<br/>
            Area: {country.area}</p>
            <h3>Languages:</h3>
            <ul>
                {Object.keys(country.languages).map((key) => 
                    <li key={key}>{country.languages[key]}</li>
                )}
            </ul>
            <img src={flagsrc} alt={flagalt}></img>
            <WeatherSection country={country} weatherInfo={weatherInfo}/>
        </>
    )
}



const CountryList = ({countries, showHandler}) => {
    if(!countries){
        return(<>Please enter search terms.</>)
    }
    else if(countries.length > 10){
        return(<>Too many countries to list, please narrow search terms. </>)
    }
    else if(countries.length === 0){
        return(<>No countries found.</>)
    }
    else if(countries.length === 1){
        return(<CountryInfo country={countries[0]}/>)
    }
    
    
    return(
        <>
            {countries.map((country, index) => 
                <CountryName key={index} country={country} showHandler={showHandler}/>
            )}
        </>
    )
}

const CountrySection = ({countries, infoCountry, showHandler}) => {
    if(!infoCountry){
        return (<CountryList countries={countries} showHandler={showHandler}/>)
    }
    return(
        <CountryInfo country={infoCountry}/>
    )
}

const App = () =>{
    const [countries, setCountries] = useState(null)
    const [filterValue, setFilter] = useState('')
    const [infoCountry, setInfoCountry] = useState(null)

    const handleFilterInput = (event) => {
        setFilter(event.target.value)
        setInfoCountry(null)
    }
    const showHandler = (coun) => {
        setInfoCountry(coun)
    }

    useEffect(() => {
        apiCall(countryApiUrl)
        .then(res => {
            setCountries(res.data)
        })
    },[])

    const searchTerm = filterValue.toLowerCase()
    let filterList = null
    if(filterValue !== '' && countries){
        filterList = countries.filter((country) => {return country.name.common.toLowerCase().search(searchTerm) >= 0})
    }

    return(
        <div>
            <form>
                <InputField label={'find countries: '} value={filterValue} handler={handleFilterInput}/>
            </form>
            <CountrySection countries={filterList} infoCountry={infoCountry} showHandler={showHandler}/>
        </div>
    )
}

export default App