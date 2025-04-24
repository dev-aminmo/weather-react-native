# Weather App

A modern, responsive weather application built with React Native and Expo that provides current weather conditions and forecasts.

## Demo

<p align="center">
  <a href="https://res.cloudinary.com/dtvc2pr8i/video/upload/v1745502445/samples/Screen_recording_20250424_141345_zl01pl.mp4">
    <img src="https://res.cloudinary.com/dtvc2pr8i/image/upload/v1745502511/samples/Screenshot_20250424_141500_qyhhgy.png" alt="Weather App Demo Video" width="320">
  </a>
</p>

*Click the image above to watch the demo video*

## Screenshots

<div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
  <img src="https://res.cloudinary.com/dtvc2pr8i/image/upload/v1745502511/samples/Screenshot_20250424_141500_qyhhgy.png" alt="Home Screen" width="250"/>
  <img src="https://res.cloudinary.com/dtvc2pr8i/image/upload/v1745502511/samples/Screenshot_20250424_141609_pmmnp0.png" alt="Search Results" width="250"/>
  <img src="https://res.cloudinary.com/dtvc2pr8i/image/upload/v1745502510/samples/Screenshot_20250424_141547_n4l9m3.png" alt="Suggestions" width="250"/>
    <img src="https://res.cloudinary.com/dtvc2pr8i/image/upload/v1745502510/samples/Screenshot_20250424_141616_n4papr.png"alt="5-Day Forecast" width="250"/>
</div>

## Features

- Current weather conditions with dynamic backgrounds
- 5-day weather forecast
- City search with autocomplete suggestions
- Responsive design for all screen sizes
- Real-time weather updates

## Setup Instructions

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI
- OpenWeatherMap API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/weather-app.git
   cd weather-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory with your OpenWeatherMap API key:
   ```
   OPENWEATHER_API_KEY=your_api_key_here
   ```
   
   > **Important:** You can obtain an API key by signing up at [OpenWeatherMap](https://openweathermap.org/api).

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on a device or emulator**
   - Press `a` for Android
   - Press `i` for iOS simulator (macOS only)
   - Scan the QR code with the Expo Go app on your device

## Technology Stack

- React Native
- TypeScript
- Expo Router
- Context API for state management
- OpenWeatherMap API

## Project Structure

```
app/
  ├── components/        # Reusable UI components
  ├── context/           # Application state management
  ├── services/          # API services
  ├── types/             # TypeScript type definitions
  ├── index.tsx          # Home screen
  ├── results.tsx        # Weather results screen
  └── _layout.tsx        # Root layout
```

## Implementation Decisions

### UI Design

The app features a clean, modern interface with:
- Dynamic gradient backgrounds that change based on weather conditions
- Card-based components for information display
- Smooth scrolling and transitions
- Intuitive search functionality

### API Integration

- Weather data is fetched from OpenWeatherMap API
- City search leverages the Geocoding API for better suggestions
- API requests are optimized with debouncing and caching

### Performance Optimizations

- Minimized re-renders using React's memo and useCallback
- Optimized image loading for weather icons
- Implemented efficient list rendering with FlatList

## Use of AI Tools

I used mostly Claude AI during development to assist with:

- Initial code structure and component design
- Debugging TypeScript issues
- Generating weather condition mappings
- UI layout refinements

All AI-generated code was thoroughly reviewed, tested, and modified to ensure it meets the project's requirements and quality standards.


## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [OpenWeatherMap](https://openweathermap.org/) for providing the weather data API
- [Expo](https://expo.dev/) for the excellent React Native development platform
- Icons provided by [Ionicons](https://ionic.io/ionicons)