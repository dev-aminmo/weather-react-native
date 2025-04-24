import { CurrentWeather, ForecastItem, CitySearchResult } from '../types/weather.types';

// Replace with your own API key from OpenWeatherMap
const API_KEY = OPENWEATHER_API_KEY;;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';
import { OPENWEATHER_API_KEY } from '@env';

interface WeatherAPIResponse {
  name: string;
  sys: {
    country: string;
  };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  dt: number;
}

interface ForecastAPIResponse {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      humidity: number;
    };
    weather: Array<{
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
    };
  }>;
}

interface GeocodeAPIResponse {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

// Search for cities by name
export const searchCities = async (query: string): Promise<CitySearchResult[]> => {
  if (!query || query.trim().length < 2) {
    return [];
  }
  
  try {
    const response = await fetch(
      `${GEO_URL}/direct?q=${query.trim()}&limit=10&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }
    
    const data: GeocodeAPIResponse[] = await response.json();
    
    // Transform the API response to our format
    return data.map(item => ({
      name: item.name,
      country: item.country,
      state: item.state,
      displayName: item.state 
        ? `${item.name}, ${item.state}, ${item.country}`
        : `${item.name}, ${item.country}`,
      lat: item.lat,
      lon: item.lon
    }));
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
};

// Fetch current weather data by city name
export const fetchWeatherByCity = async (city: string): Promise<CurrentWeather> => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data: WeatherAPIResponse = await response.json();
    
    return {
      city: data.name,
      country: data.sys.country,
      temp: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      windSpeed: data.wind.speed,
      timestamp: new Date(data.dt * 1000),
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw error;
  }
};

// Fetch 5-day/3-hour forecast data by city name
export const fetchForecastByCity = async (city: string): Promise<ForecastItem[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Forecast API error: ${response.status}`);
    }
    
    const data: ForecastAPIResponse = await response.json();
    
    // Process the forecast data (taking one forecast per day)
    const processedData: ForecastItem[] = data.list
      .filter((item, index) => index % 8 === 0) // Get one reading per day (every 24 hours)
      .map(item => ({
        date: new Date(item.dt * 1000),
        temp: item.main.temp,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        humidity: item.main.humidity,
        windSpeed: item.wind.speed,
      }));
      
    return processedData;
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
};