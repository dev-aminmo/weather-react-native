import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  onClear?: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ 
  value, 
  onChangeText, 
  onSubmit, 
  placeholder = 'Search for a city...',
  onClear
}) => {
  return (
    <View style={styles.container}>
      <BlurView intensity={30} tint="light" style={styles.blurContainer}>
        <View style={styles.searchContainer}>
          <TouchableOpacity 
            style={styles.searchIcon}
            onPress={onSubmit}
          >
            <Ionicons name="search" size={20} color="#4a90e2" />
          </TouchableOpacity>
          
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="#94a3b8"
            value={value}
            onChangeText={onChangeText}
            returnKeyType="search"
            onSubmitEditing={onSubmit}
            autoCapitalize="words"
          />
          
          {value.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={onClear}
            >
              <Ionicons name="close-circle" size={18} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  blurContainer: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#334155',
    height: '100%',
  },
  clearButton: {
    padding: 5,
  },
});

export default SearchInput;



