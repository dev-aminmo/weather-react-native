import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { CurrentWeather } from '../types/weather.types';

interface WeatherCardProps {
  weather: CurrentWeather | null;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  if (!weather) return null;

  // Function to determine background gradient based on weather
  const getWeatherGradient = () => {
    const desc = weather.description.toLowerCase();
    
    if (desc.includes('clear')) return ['#4a90e2', '#87CEEB'] as const;
    if (desc.includes('cloud')) return ['#b0c4de', '#778899'] as const;
    if (desc.includes('rain') || desc.includes('drizzle')) return ['#708090', '#4682B4'] as const;
    if (desc.includes('thunder')) return ['#4b0082', '#483D8B'] as const;
    if (desc.includes('snow')) return ['#e6e6fa', '#b0c4de'] as const;
    if (desc.includes('mist') || desc.includes('fog')) return ['#dcdcdc', '#a9a9a9'] as const;
    
    return ['#4a90e2', '#5ca0f2'] as const; // default blue
  };
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={getWeatherGradient()}
        style={[styles.card, { borderRadius: 20 }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.cardContent}>
          <View style={styles.leftContent}>
            <Text style={styles.temperature}>{Math.round(weather.temp)}°</Text>
            <Text style={styles.description}>{weather.description}</Text>
            <Text style={styles.feelsLike}>Feels like {Math.round(weather.feelsLike)}°</Text>
          </View>
          
          <View style={styles.rightContent}>
            <Image 
              source={{ uri: `https://openweathermap.org/img/wn/${weather.icon}@4x.png` }} 
              style={styles.weatherIcon} 
            />
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.detailsSection}>
          <View style={styles.detailItem}>
            <Ionicons name="water-outline" size={18} color="rgba(255, 255, 255, 0.8)" />
            <Text style={styles.detailValue}>{weather.humidity}%</Text>
            <Text style={styles.detailLabel}>Humidity</Text>
          </View>
          
          <View style={styles.detailSeparator} />
          
          <View style={styles.detailItem}>
            <Ionicons name="speedometer-outline" size={18} color="rgba(255, 255, 255, 0.8)" />
            <Text style={styles.detailValue}>{weather.windSpeed}</Text>
            <Text style={styles.detailLabel}>Wind (m/s)</Text>
          </View>
          
          <View style={styles.detailSeparator} />
          
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={18} color="rgba(255, 255, 255, 0.8)" />
            <Text style={styles.detailValue}>
              {weather.timestamp.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
              })}
            </Text>
            <Text style={styles.detailLabel}>Updated</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    marginHorizontal:20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,

  },
  card: {
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 20,
  },
  leftContent: {
    flex: 1,
    justifyContent: 'center',
  },
  rightContent: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  temperature: {
    fontSize: 48,
    fontWeight: '300',
    color: 'white',
  },
  description: {
    fontSize: 16,
    color: 'white',
    textTransform: 'capitalize',
    marginTop: 5,
  },
  feelsLike: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  weatherIcon: {
    width: 100,
    height: 100,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 20,
  },
  detailsSection: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginTop: 5,
  },
  detailSeparator: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 5,
  }
});

export default WeatherCard;