import { type WeatherData } from '../utils/weatherApi';
import { Cloud, Sun, CloudRain, CloudLightning, Snowflake } from 'lucide-react';
import './HourlyForecast.css';

interface Props {
  data: WeatherData;
}

export const HourlyForecast = ({ data }: Props) => {
  const nowTs = new Date(data.current.time).getTime();
  const currentHourIndex = data.hourly.time.findIndex((t) => new Date(t).getTime() > nowTs);
  const startIndex = currentHourIndex > 0 ? currentHourIndex - 1 : 0;
  
  const hoursToDisplay = 24;
  const times = data.hourly.time.slice(startIndex, startIndex + hoursToDisplay);
  const temps = data.hourly.temperature_2m.slice(startIndex, startIndex + hoursToDisplay);
  const codes = data.hourly.weather_code.slice(startIndex, startIndex + hoursToDisplay);
  const rainChance = data.hourly.precipitation_probability.slice(startIndex, startIndex + hoursToDisplay);

  const getIcon = (code: number, timeStr: string) => {
    const isDay = new Date(timeStr).getHours() > 6 && new Date(timeStr).getHours() < 19;
    if (code === 0) return isDay ? <Sun size={24} /> : <Cloud size={24} />;
    if (code >= 1 && code <= 3) return <Cloud size={24} />;
    if (code >= 61 && code <= 65) return <CloudRain size={24} />;
    if (code >= 71 && code <= 75) return <Snowflake size={24} />;
    if (code >= 95) return <CloudLightning size={24} />;
    return <Cloud size={24} />;
  };

  return (
    <section className="hourly-container glass panel">
      <h3 className="panel-title">Hourly Forecast</h3>
      <div className="hourly-scroll">
        {times.map((time, index) => {
          const date = new Date(time);
          const isNow = index === 0;
          return (
            <div key={time} className={`hourly-item ${isNow ? 'now' : ''}`}>
              <span className="hour-text">{isNow ? 'Now' : date.toLocaleTimeString([], { hour: 'numeric' })}</span>
              <div className="hour-icon">{getIcon(codes[index], time)}</div>
              <span className="hour-temp">{Math.round(temps[index])}°</span>
              <span className="hour-rain">{Math.round(rainChance[index] ?? 0)}%</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
