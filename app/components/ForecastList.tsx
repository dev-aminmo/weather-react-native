import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ForecastItem } from '../types/weather.types';
import { Ionicons } from '@expo/vector-icons';

interface ForecastListProps {
  forecast: ForecastItem[];
}

const ForecastList: React.FC<ForecastListProps> = ({ forecast }) => {
  if (!forecast || forecast.length === 0) return null;
  
  // Function to get day name
  const getDayName = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
  };
  
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {forecast.map((item, index) => (
        <View
          key={index}
          style={[
            styles.forecastCard,
            { marginLeft: index === 0 ? 0 : 12 }
          ]}
        >
          <LinearGradient
            colors={['#ffffff', '#f8f9fa'] as const}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <View style={styles.cardContent}>
              <Text style={styles.dayText}>{getDayName(item.date)}</Text>
              
              <View style={styles.iconContainer}>
                <Image
                  source={{ uri: `https://openweathermap.org/img/wn/${item.icon}@2x.png` }}
                  style={styles.weatherIcon}
                />
              </View>
              
              <Text style={styles.tempText}>{Math.round(item.temp)}°</Text>
              
              <Text 
                style={styles.descriptionText} 
                numberOfLines={2} 
                ellipsizeMode="tail"
              >
                {item.description}
              </Text>
            </View>
            
            {/* Padding view to create space between description and details */}
            <View style={styles.spacer} />
            
            {/* Details row in a fixed-position container */}
            <View style={styles.detailsRowContainer}>
              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <Ionicons name="water-outline" size={14} color="#64748b" />
                  <Text style={styles.detailText}>{item.humidity}%</Text>
                </View>
                
                <View style={styles.detailItem}>
                  <Ionicons name="speedometer-outline" size={14} color="#64748b" />
                  <Text style={styles.detailText}>{item.windSpeed}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingRight: 0,
    paddingTop: 10,
    paddingBottom: 20,
  },
  forecastCard: {
    width: 120,
    height: 200,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardGradient: {
    flex: 1,
    justifyContent: 'space-between', // Space content evenly
  },
  cardContent: {
    padding: 15,
    paddingBottom: 0, // Remove bottom padding
    alignItems: 'center',
    flex: 1,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  weatherIcon: {
    width: 50,
    height: 50,
  },
  tempText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#334155',
    marginVertical: 4,
  },
  descriptionText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    textTransform: 'capitalize',
    width: '100%',
    minHeight: 30, // Ensure consistent height for 2 lines
    lineHeight: 16, // Provide good spacing between lines
  },
  spacer: {
    height: 8, // Add padding/space between description and details row
  },
  detailsRowContainer: {
    paddingHorizontal: 10,
    paddingBottom: 15,
    paddingTop: 5,
    width: '100%',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
  }
});

export default ForecastList;