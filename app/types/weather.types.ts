export interface CurrentWeather {
  city: string;
  country: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  description: string;
  icon: string;
  windSpeed: number;
  timestamp: Date;
}

export interface ForecastItem {
  date: Date;
  temp: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

export interface CitySearchResult {
  name: string;
  country: string;
  state?: string;
  displayName: string;
  lat: number;
  lon: number;
}

export interface WeatherContextType {
  currentWeather: CurrentWeather | null;
  forecast: ForecastItem[];
  loading: boolean;
  error: string | null;
  city: string;
  fetchWeather: (cityName: string) => Promise<void>;
}