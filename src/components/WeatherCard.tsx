import { type WeatherData, getWeatherDescription } from '../utils/weatherApi';
import { Cloud, Sun, CloudRain, CloudLightning, Snowflake } from 'lucide-react';
import './WeatherCard.css';

interface Props {
  data: WeatherData;
  city: string;
}

const getWeatherIcon = (code: number, isDay: boolean) => {
  if (code === 0) return isDay ? <Sun size={64} /> : <Cloud size={64} />;
  if (code >= 1 && code <= 3) return <Cloud size={64} />;
  if (code >= 61 && code <= 65) return <CloudRain size={64} />;
  if (code >= 71 && code <= 75) return <Snowflake size={64} />;
  if (code >= 95) return <CloudLightning size={64} />;
  return <Cloud size={64} />;
};

export const WeatherCard = ({ data, city }: Props) => {
  const code = data.current.weathercode;
  const description = getWeatherDescription(code);
  const temp = Math.round(data.current.temperature);
  const feelsLike = Math.round(data.current.apparent_temperature);
  const isDay = data.current.is_day === 1;

  let bgClass = 'bg-sunny';
  if (!isDay) bgClass = 'bg-night';
  else if (code >= 50 && code <= 99) bgClass = 'bg-rainy';
  else if (code >= 1 && code <= 48) bgClass = 'bg-cloudy';

  return (
    <section className={`weather-card glass ${bgClass}`}>
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
    </section>
  );
};
