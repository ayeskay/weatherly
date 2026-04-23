import { Activity } from 'lucide-react';
import { type WeatherData } from '../utils/weatherApi';
import './AirQualityCard.css';

interface Props {
  data: WeatherData;
}

const getAqiBand = (aqi: number | undefined) => {
  if (aqi === undefined) return { label: 'Unavailable', className: 'aqi-unknown' };
  if (aqi <= 50) return { label: 'Good', className: 'aqi-good' };
  if (aqi <= 100) return { label: 'Moderate', className: 'aqi-moderate' };
  if (aqi <= 150) return { label: 'Unhealthy (Sensitive)', className: 'aqi-sensitive' };
  if (aqi <= 200) return { label: 'Unhealthy', className: 'aqi-unhealthy' };
  return { label: 'Very Unhealthy', className: 'aqi-very-unhealthy' };
};

export const AirQualityCard = ({ data }: Props) => {
  const band = getAqiBand(data.aqi);

  return (
    <section className="air-quality-card glass panel">
      <h3 className="panel-title">Air Quality</h3>
      <div className="air-main">
        <Activity size={18} />
        <strong>{data.aqi ?? '--'}</strong>
        <span>US AQI</span>
      </div>
      <p className={`air-band ${band.className}`}>{band.label}</p>
    </section>
  );
};
