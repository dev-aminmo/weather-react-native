import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  Dimensions,
  RefreshControl
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useWeather } from './context/WeatherContext';
import LoadingIndicator from './components/LoadingIndicator';
import ErrorMessage from './components/ErrorMessage';

export default function ResultsScreen() {
  const { city } = useLocalSearchParams<{ city: string }>();
  const { currentWeather, forecast, loading, error, fetchWeather } = useWeather();
  const router = useRouter();
  const { width } = Dimensions.get('window');
  const [refreshing, setRefreshing] = React.useState(false);
  
  useEffect(() => {
    if (city) {
      fetchWeather(city);
    }
  }, [city]);

  if (loading && !currentWeather) {
    return <LoadingIndicator />;
  }

  const onRefresh = async () => {
    setRefreshing(true);
    if (city) {
      await fetchWeather(city);
    }
    setRefreshing(false);
  };

  // Get weather conditions to determine background gradient
  const getWeatherGradient = () => {
    if (!currentWeather) return ['#4a90e2', '#5ca0f2'] as const;
    
    const desc = currentWeather.description.toLowerCase();
    
    if (desc.includes('clear')) return ['#4a90e2', '#87CEEB'] as const;
    if (desc.includes('cloud')) return ['#b0c4de', '#778899'] as const;
    if (desc.includes('rain') || desc.includes('drizzle')) return ['#708090', '#4682B4'] as const;
    if (desc.includes('thunder')) return ['#4b0082', '#483D8B'] as const;
    if (desc.includes('snow')) return ['#e6e6fa', '#b0c4de'] as const;
    if (desc.includes('mist') || desc.includes('fog')) return ['#dcdcdc', '#a9a9a9'] as const;
    
    return ['#4a90e2', '#5ca0f2'] as const; // default blue
  };

  // Get day of week
  const getDayOfWeek = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Main Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        scrollEnabled={true}
        bounces={true}
      >
        {/* Header with Gradient Background */}
        <LinearGradient
          colors={getWeatherGradient()}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Navigation Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {currentWeather?.city || city}
            </Text>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={onRefresh}
            >
              <Ionicons name="refresh" size={24} color="white" />
            </TouchableOpacity>
          </View>
          
          {/* Current Weather Section */}
          <View style={styles.currentWeatherContainer}>
            <View style={styles.weatherIconContainer}>
              {currentWeather?.icon && (
                <Image
                  source={{ uri: `https://openweathermap.org/img/wn/${currentWeather.icon}@4x.png` }}
                  style={styles.weatherIcon}
                />
              )}
            </View>
            
            <Text style={styles.temperatureText}>
              {currentWeather?.temp ? Math.round(currentWeather.temp) : '--'}°
            </Text>
            
            <Text style={styles.weatherDescription}>
              {currentWeather?.description || 'Loading weather data...'}
            </Text>
            
            <Text style={styles.feelsLikeText}>
              Feels like {currentWeather?.feelsLike ? Math.round(currentWeather.feelsLike) : '--'}°
            </Text>
          </View>
        </LinearGradient>
        
        {error ? (
          <ErrorMessage message={error} onRetry={() => city && fetchWeather(city)} />
        ) : (
          <>
            {/* Weather Details Card */}
            <View style={styles.detailsCard}>
              <View style={styles.detailRow}>
                <View style={styles.detailColumn}>
                  <Ionicons name="water-outline" size={22} color="#4a90e2" />
                  <Text style={styles.detailValue}>{currentWeather?.humidity || '--'}%</Text>
                  <Text style={styles.detailLabel}>Humidity</Text>
                </View>
                
                <View style={styles.detailDivider} />
                
                <View style={styles.detailColumn}>
                  <Ionicons name="speedometer-outline" size={22} color="#4a90e2" />
                  <Text style={styles.detailValue}>{currentWeather?.windSpeed || '--'} m/s</Text>
                  <Text style={styles.detailLabel}>Wind Speed</Text>
                </View>
              </View>
              
              <View style={styles.horizontalDivider} />
              
              <View style={styles.detailRow}>
                <View style={styles.detailColumn}>
                  <Ionicons name="time-outline" size={22} color="#4a90e2" />
                  <Text style={styles.detailValue}>
                    {currentWeather?.timestamp ? formatTime(currentWeather.timestamp) : '--'}
                  </Text>
                  <Text style={styles.detailLabel}>Local Time</Text>
                </View>
                
                <View style={styles.detailDivider} />
                
                <View style={styles.detailColumn}>
                  <Ionicons name="calendar-outline" size={22} color="#4a90e2" />
                  <Text style={styles.detailValue}>
                    {currentWeather?.timestamp ? getDayOfWeek(currentWeather.timestamp) : '--'}
                  </Text>
                  <Text style={styles.detailLabel}>Day</Text>
                </View>
              </View>
            </View>
            
            {/* Forecast */}
            <Text style={styles.forecastTitle}>5-Day Forecast</Text>
            <View style={styles.forecastCard}>
              {forecast.map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <View style={styles.forecastDivider} />}
                  <View style={styles.forecastDay}>
                    <Text style={styles.forecastDayText}>
                      {getDayOfWeek(item.date)}
                    </Text>
                    
                    <Image
                      source={{ uri: `https://openweathermap.org/img/wn/${item.icon}.png` }}
                      style={styles.forecastIcon}
                    />
                    
                    <Text style={styles.forecastTemp}>
                      {Math.round(item.temp)}°
                    </Text>
                  </View>
                </React.Fragment>
              ))}
            </View>
            
            {/* Wind & Humidity */}
            <View style={styles.additionalDetails}>
              <View style={styles.additionalCard}>
                <Text style={styles.additionalTitle}>
                  <Ionicons name="leaf-outline" size={16} color="#4a90e2" /> Wind
                </Text>
                <Text style={styles.additionalValue}>
                  {currentWeather?.windSpeed || '--'} m/s
                </Text>
                <View style={styles.windDirection}>
                  <Ionicons name="navigate" size={24} color="#4a90e2" style={{ transform: [{ rotate: '315deg' }] }} />
                  <Text style={styles.windDirectionText}>NW</Text>
                </View>
              </View>
              
              <View style={styles.additionalCard}>
                <Text style={styles.additionalTitle}>
                  <Ionicons name="water-outline" size={16} color="#4a90e2" /> Humidity
                </Text>
                <Text style={styles.additionalValue}>
                  {currentWeather?.humidity || '--'}%
                </Text>
                <View style={styles.humidityBar}>
                  <View style={[styles.humidityFill, { width: `${currentWeather?.humidity || 0}%` }]} />
                </View>
              </View>
            </View>
            
            {/* Footer */}
            <Text style={styles.footerText}>
              Data from OpenWeatherMap • Last updated: {currentWeather?.timestamp ? formatTime(currentWeather.timestamp) : '--'}
            </Text>
          </>
        )}
      </ScrollView>
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
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  currentWeatherContainer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
  },
  weatherIconContainer: {
    height: 120,
    justifyContent: 'center',
  },
  weatherIcon: {
    width: 120,
    height: 120,
  },
  temperatureText: {
    fontSize: 72,
    fontWeight: '200',
    color: 'white',
    marginTop: -10,
  },
  weatherDescription: {
    fontSize: 18,
    color: 'white',
    textTransform: 'capitalize',
    marginTop: 5,
  },
  feelsLikeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  detailsCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
  },
  detailColumn: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 5,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginTop: 5,
  },
  detailDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#e2e8f0',
  },
  horizontalDivider: {
    height: 1,
    width: '90%',
    backgroundColor: '#e2e8f0',
    alignSelf: 'center',
    marginVertical: 5,
  },
  forecastTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginTop: 30,
    marginBottom: 15,
    marginHorizontal: 20,
  },
  forecastCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 15,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  forecastDay: {
    alignItems: 'center',
    flex: 1,
  },
  forecastDayText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  forecastIcon: {
    width: 40,
    height: 40,
    marginVertical: 5,
  },
  forecastTemp: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  forecastDivider: {
    width: 1,
    height: '70%',
    backgroundColor: '#e2e8f0',
    alignSelf: 'center',
  },
  additionalDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginHorizontal: 20,
  },
  additionalCard: {
    flex: 0.48,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  additionalTitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 10,
  },
  additionalValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 10,
  },
  windDirection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  windDirectionText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 5,
  },
  humidityBar: {
    height: 8,
    width: '100%',
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    marginTop: 15,
    overflow: 'hidden',
  },
  humidityFill: {
    height: '100%',
    backgroundColor: '#4a90e2',
    borderRadius: 4,
  },
  footerText: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 10,
  }
});