import { Cloud, CloudLightning, CloudRain, Snowflake, Sun } from 'lucide-react';
import { type WeatherData } from '../utils/weatherApi';
import './DailyForecast.css';

interface Props {
  data: WeatherData;
}

const getIcon = (code: number) => {
  if (code === 0) return <Sun size={20} />;
  if (code >= 1 && code <= 3) return <Cloud size={20} />;
  if (code >= 61 && code <= 65) return <CloudRain size={20} />;
  if (code >= 71 && code <= 75) return <Snowflake size={20} />;
  if (code >= 95) return <CloudLightning size={20} />;
  return <Cloud size={20} />;
};

export const DailyForecast = ({ data }: Props) => {
  const days = data.daily.time.slice(0, 7);

  return (
    <section className="daily-forecast glass panel">
      <h3 className="panel-title">7-Day Forecast</h3>
      <div className="daily-list">
        {days.map((day, index) => {
          const label = new Date(day).toLocaleDateString([], { weekday: 'short' });
          const max = Math.round(data.daily.temperature_2m_max[index] ?? 0);
          const min = Math.round(data.daily.temperature_2m_min[index] ?? 0);
          const code = data.daily.weathercode[index] ?? 0;
          const rainChance = data.daily.precipitation_probability_max[index] ?? 0;

          return (
            <article className="daily-item" key={day}>
              <span className="day-label">{index === 0 ? 'Today' : label}</span>
              <span className="day-icon">{getIcon(code)}</span>
              <span className="day-temps">{max}° / {min}°</span>
              <span className="day-rain">{rainChance}% rain</span>
            </article>
          );
        })}
      </div>
    </section>
  );
};
