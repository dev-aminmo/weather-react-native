import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  RefreshControl,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useWeather } from './context/WeatherContext';
import { searchCities } from './services/weatherApi';
import { CitySearchResult } from './types/weather.types';
import WeatherCard from './components/WeatherCard';
import ForecastList from './components/ForecastList';
import LoadingIndicator from './components/LoadingIndicator';
import ErrorMessage from './components/ErrorMessage';

// Default popular cities to show
const DEFAULT_CITIES = [
  { name: 'New York', country: 'US', displayName: 'New York, US' },
  { name: 'London', country: 'GB', displayName: 'London, GB' },
  { name: 'Tokyo', country: 'JP', displayName: 'Tokyo, JP' },
  { name: 'Paris', country: 'FR', displayName: 'Paris, FR' },
  { name: 'Sydney', country: 'AU', displayName: 'Sydney, AU' },
];

export default function HomeScreen() {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchResults, setSearchResults] = useState<CitySearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { currentWeather, forecast, loading, error, city, fetchWeather } = useWeather();
  const router = useRouter();
  
  useEffect(() => {
    // Fetch weather data for default city when component mounts
    fetchWeather('New York');
  }, []);

  // Search cities with API when query changes
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (!query || query.trim().length < 2) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const results = await searchCities(query);
        setSearchResults(results);
      } catch (err) {
        console.error('Error searching cities:', err);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(searchTimeout);
  }, [query]);
  
  const handleSearch = (cityName: string) => {
    Keyboard.dismiss();
    setShowSuggestions(false);
    setQuery('');
    
    // Navigate to results page with the city name
    router.push({
      pathname: '/results',
      params: { city: cityName }
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchWeather(city);
    setIsRefreshing(false);
  };

  const handleOutsidePress = () => {
    Keyboard.dismiss();
    setShowSuggestions(false);
  };

  if (loading && !currentWeather) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Single ScrollView containing everything */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        scrollEnabled={true}
      >
        {/* Header with Gradient and Search */}
        <LinearGradient
          colors={['#4a90e2', '#5ca0f2'] as const}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <TouchableOpacity 
                style={styles.searchIconContainer}
                onPress={() => query && handleSearch(query)}
              >
                <Ionicons name="search" size={20} color="#4a90e2" />
              </TouchableOpacity>
              <TextInput
                style={styles.searchInput}
                placeholder="Search city..."
                placeholderTextColor="#8EAED9"
                value={query}
                onChangeText={(text) => {
                  setQuery(text);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                returnKeyType="search"
                onSubmitEditing={() => query && handleSearch(query)}
              />
              {query.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => {
                    setQuery('');
                    setShowSuggestions(false);
                    setSearchResults([]);
                  }}
                >
                  <Ionicons name="close-circle" size={18} color="#8EAED9" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </LinearGradient>
        
        {/* Current Location */}
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={18} color="#4a90e2" />
          <Text style={styles.locationText}>{currentWeather?.city || city}</Text>
        </View>
        
        {error ? (
          <ErrorMessage message={error} onRetry={() => fetchWeather(city)} />
        ) : (
          <>
            {/* Current Weather */}
            <WeatherCard weather={currentWeather} />
            
            {/* Forecast */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>5-Day Forecast</Text>
              <ForecastList forecast={forecast} />
            </View>
            
            {/* Weather Details */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Weather Details</Text>
              <View style={styles.detailsCard}>
                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Ionicons name="water-outline" size={24} color="#4a90e2" />
                    <Text style={styles.detailLabel}>Humidity</Text>
                    <Text style={styles.detailValue}>{currentWeather?.humidity || 0}%</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="speedometer-outline" size={24} color="#4a90e2" />
                    <Text style={styles.detailLabel}>Pressure</Text>
                    <Text style={styles.detailValue}>1013 hPa</Text>
                  </View>
                </View>
                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Ionicons name="eye-outline" size={24} color="#4a90e2" />
                    <Text style={styles.detailLabel}>Visibility</Text>
                    <Text style={styles.detailValue}>10 km</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="thermometer-outline" size={24} color="#4a90e2" />
                    <Text style={styles.detailLabel}>Feels Like</Text>
                    <Text style={styles.detailValue}>{currentWeather?.feelsLike ? Math.round(currentWeather.feelsLike) : 0}°C</Text>
                  </View>
                </View>
              </View>
            </View>
            
            {/* Footer */}
            <Text style={styles.footerText}>
              Data provided by OpenWeatherMap
            </Text>
          </>
        )}
      </ScrollView>
      
      {/* Suggestions Dropdown - Positioned absolutely */}
      {showSuggestions && (
        <TouchableWithoutFeedback onPress={handleOutsidePress}>
          <View style={styles.suggestionsTouchable}>
            <View style={styles.suggestionsContainer}>
              <View style={styles.suggestionsContent}>
                {isSearching ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator color="#4a90e2" />
                    <Text style={styles.loadingText}>Searching cities...</Text>
                  </View>
                ) : (
                  <FlatList
                    data={query.length < 2 ? DEFAULT_CITIES : searchResults}
                    keyExtractor={(item, index) => `${item.name}-${item.country}-${index}`}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.suggestionItem}
                        onPress={() => handleSearch(item.name)}
                      >
                        <Ionicons name="location" size={18} color="#4a90e2" />
                        <Text style={styles.suggestionText}>{item.displayName}</Text>
                      </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                      query.length >= 2 ? (
                        <Text style={styles.noResultsText}>
                          No matching cities found
                        </Text>
                      ) : null
                    }
                  />
                )}
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  searchContainer: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIconContainer: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#334155',
    height: '100%',
  },
  clearButton: {
    padding: 5,
  },
  suggestionsTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 120 : 100,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  suggestionsContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  suggestionText: {
    fontSize: 16,
    color: '#334155',
    marginLeft: 10,
  },
  noResultsText: {
    textAlign: 'center',
    padding: 20,
    color: '#94a3b8',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#64748b',
    fontSize: 14,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  locationText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#334155',
    marginLeft: 5,
  },
  sectionContainer: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 15,
  },
  detailsCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 5,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginTop: 5,
  },
  footerText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 12,
    color: '#94a3b8',
    paddingHorizontal: 20,
  }
});