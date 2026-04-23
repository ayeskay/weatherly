import { Sunrise, Sunset } from 'lucide-react';
import { type WeatherData } from '../utils/weatherApi';
import './SunTimesCard.css';

interface Props {
  data: WeatherData;
}

const formatTime = (time: string) => {
  if (!time) return '--';
  return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const getDayLength = (sunrise: string, sunset: string) => {
  if (!sunrise || !sunset) return '--';
  const start = new Date(sunrise).getTime();
  const end = new Date(sunset).getTime();
  const minutes = Math.max(0, Math.round((end - start) / 60000));
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

export const SunTimesCard = ({ data }: Props) => {
  const { sunrise, sunset } = data.highlights;

  return (
    <section className="sun-times-card glass panel">
      <h3 className="panel-title">Sun Cycle</h3>
      <div className="sun-row">
        <div className="sun-item">
          <Sunrise size={18} />
          <span>Sunrise</span>
          <strong>{formatTime(sunrise)}</strong>
        </div>
        <div className="sun-item">
          <Sunset size={18} />
          <span>Sunset</span>
          <strong>{formatTime(sunset)}</strong>
        </div>
      </div>
      <p className="sun-meta">Daylight: {getDayLength(sunrise, sunset)}</p>
    </section>
  );
};
