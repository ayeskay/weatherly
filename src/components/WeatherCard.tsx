import { type WeatherData, getWeatherDescription } from '../utils/weatherApi';
import { Cloud, Sun, CloudRain, CloudLightning, Snowflake } from 'lucide-react';
import './WeatherCard.css';

interface Props {
  data: WeatherData;
  city: string;
}

type WeatherVariant = 'sunny' | 'cloudy' | 'rainy' | 'night' | 'storm';

const getWeatherIcon = (code: number, isDay: boolean) => {
  if (code === 0) return isDay ? <Sun size={88} /> : <Cloud size={88} />;
  if (code >= 1 && code <= 3) return <Cloud size={88} />;
  if (code >= 61 && code <= 65) return <CloudRain size={88} />;
  if (code >= 71 && code <= 75) return <Snowflake size={88} />;
  if (code >= 95) return <CloudLightning size={88} />;
  return <Cloud size={88} />;
};

const getWeatherVariant = (code: number, isDay: boolean): WeatherVariant => {
  if (!isDay) return 'night';
  if (code >= 95) return 'storm';
  if (code >= 51) return 'rainy';
  if (code >= 1 && code <= 48) return 'cloudy';
  return 'sunny';
};

export const WeatherCard = ({ data, city }: Props) => {
  const code = data.current.weathercode;
  const description = getWeatherDescription(code);
  const temp = Math.round(data.current.temperature);
  const feelsLike = Math.round(data.current.apparent_temperature);
  const isDay = data.current.is_day === 1;
  const variant = getWeatherVariant(code, isDay);

  return (
    <section className={`weather-card glass weather-${variant}`}>
      <div className="weather-card__bg" aria-hidden="true" />
      <div className="weather-card__glow" aria-hidden="true" />
      <div className={`weather-card__fx weather-card__fx--${variant}`} aria-hidden="true">
        {variant === 'sunny' && <span className="fx-sun-halo" />}
        {variant === 'cloudy' && (
          <>
            <span className="fx-cloud fx-cloud--a" />
            <span className="fx-cloud fx-cloud--b" />
          </>
        )}
        {(variant === 'rainy' || variant === 'storm') && (
          <>
            <span className="fx-rain fx-rain--1" />
            <span className="fx-rain fx-rain--2" />
            <span className="fx-rain fx-rain--3" />
            <span className="fx-rain fx-rain--4" />
          </>
        )}
        {variant === 'storm' && <span className="fx-storm-flash" />}
        {variant === 'night' && <span className="fx-moon-glow" />}
      </div>

      <div className="weather-card__content">
        <div className="card-header">
          <h2>{city}</h2>
          <span className="time">
            {new Date(data.current.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <div className="card-main">
          <div className="icon-wrapper">
            {getWeatherIcon(code, isDay)}
          </div>
          <div className="temp-wrapper">
            <h1>{temp}°</h1>
            <p>{description}</p>
            <small>Feels like {feelsLike}°</small>
          </div>
        </div>
      </div>
    </section>
  );
};
