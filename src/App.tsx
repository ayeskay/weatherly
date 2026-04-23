import { useEffect, useState } from 'react';
import { CloudRain } from 'lucide-react';
import { useGeolocation } from './hooks/useGeolocation';
import { fetchWeather, type WeatherData } from './utils/weatherApi';
import { reverseGeocode } from './utils/geoApi';
import { WeatherCard } from './components/WeatherCard';
import { HourlyForecast } from './components/HourlyForecast';
import { DetailGrid } from './components/DetailGrid';
import { DailyForecast } from './components/DailyForecast';
import { SunTimesCard } from './components/SunTimesCard';
import { PrecipitationCard } from './components/PrecipitationCard';
import { AirQualityCard } from './components/AirQualityCard';
import { ComfortIndexCard } from './components/ComfortIndexCard';
import { WeatherInsights } from './components/WeatherInsights';
import { VisibilityCard } from './components/VisibilityCard';
import { PressureCard } from './components/PressureCard';
import { DewPointCard } from './components/DewPointCard';
import { WindDirectionCard } from './components/WindDirectionCard';
import './styles/global.css';
import './App.css';

function App() {
  const { coordinates, error: geoError, loading: geoLoading, isFallback } = useGeolocation();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [city, setCity] = useState('Locating...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!coordinates) return;

    let isActive = true;

    const loadDashboard = async () => {
      try {
        const [weatherData, cityName] = await Promise.all([
          fetchWeather(coordinates.lat, coordinates.lon),
          reverseGeocode(coordinates.lat, coordinates.lon),
        ]);

        if (!isActive) return;
        setWeather(weatherData);
        setCity(cityName);
        setError(null);
      } catch (err) {
        if (!isActive) return;
        const message = err instanceof Error ? err.message : 'Failed to load weather dashboard';
        setError(message);
      }
    };

    void loadDashboard();

    return () => {
      isActive = false;
    };
  }, [coordinates]);

  const weatherLoading = Boolean(coordinates) && !weather && !error;

  const renderContent = () => {
    if (geoLoading || weatherLoading) {
      return (
        <div className="status-state">
          <div className="spinner"></div>
          <p>Loading your weather dashboard...</p>
        </div>
      );
    }

    if (geoError || error) {
      return (
        <div className="status-state error-state">
          <h2>Weather data unavailable</h2>
          <p>{geoError || error}</p>
        </div>
      );
    }

    if (!weather) {
      return (
        <div className="status-state">
          <p>No weather data available yet.</p>
        </div>
      );
    }

    return (
      <div className="dashboard">
        {isFallback && (
          <div className="fallback-banner">Location disabled. Showing generalized IP region.</div>
        )}

        {/* Hero: main weather card + side panel with sun, aqi, visibility, pressure */}
        <section className="hero-grid">
          <WeatherCard data={weather} city={city} />
          <div className="hero-side">
            <SunTimesCard data={weather} />
            <AirQualityCard data={weather} />
            <VisibilityCard data={weather} />
            <PressureCard data={weather} />
          </div>
        </section>

        {/* Feature strip: dew point, wind direction, plus detail metrics */}
        <section className="feature-grid">
          <DewPointCard data={weather} />
          <WindDirectionCard data={weather} />
          <PrecipitationCard data={weather} />
          <ComfortIndexCard data={weather} />
        </section>

        {/* Core details + hourly */}
        <section className="metrics-grid">
          <DetailGrid data={weather} />
          <HourlyForecast data={weather} />
        </section>

        {/* Forecasts */}
        <section className="forecast-grid">
          <DailyForecast data={weather} />
          <WeatherInsights data={weather} />
        </section>
      </div>
    );
  };

  return (
    <div className="app-container">
      <header className="app-bar">
        <div className="logo-wrapper">
          <CloudRain size={28} color="var(--md-sys-color-primary)" />
          <div>
            <h1 className="logo">Weatherly</h1>
            <p className="logo-subtitle">Live local conditions with actionable daily insights</p>
          </div>
        </div>
      </header>

      <main className="main-content">{renderContent()}</main>
    </div>
  );
}

export default App;
