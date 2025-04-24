import React, { createContext, useState, useContext, ReactNode } from 'react';
import { fetchWeatherByCity, fetchForecastByCity } from '../services/weatherApi';
import { CurrentWeather, ForecastItem, WeatherContextType } from '../types/weather.types';

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const useWeather = (): WeatherContextType => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};

interface WeatherProviderProps {
  children: ReactNode;
}

export const WeatherProvider: React.FC<WeatherProviderProps> = ({ children }) => {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState<string>('New York'); // Default city

  const fetchWeather = async (cityName: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const weatherData = await fetchWeatherByCity(cityName);
      setCurrentWeather(weatherData);
      
      const forecastData = await fetchForecastByCity(cityName);
      setForecast(forecastData);
      
      setCity(cityName);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const value: WeatherContextType = {
    currentWeather,
    forecast,
    loading,
    error,
    city,
    fetchWeather,
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};