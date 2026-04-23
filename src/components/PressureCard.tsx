import { Gauge } from 'lucide-react';
import { type WeatherData } from '../utils/weatherApi';
import './FeatureCard.css';

interface Props {
  data: WeatherData;
}

const getPressureTrend = (hPa: number) => {
  if (hPa >= 1020) return 'High — Settled';
  if (hPa >= 1009) return 'Normal';
  return 'Low — Unsettled';
};

export const PressureCard = ({ data }: Props) => {
  const pressure = Math.round(data.current.surface_pressure);
  const trend = getPressureTrend(pressure);

  return (
    <div className="feature-card glass panel">
      <div className="feature-card__icon">
        <Gauge size={22} />
      </div>
      <span className="feature-card__label">Pressure</span>
      <strong className="feature-card__value">{pressure} hPa</strong>
      <span className="feature-card__hint">{trend}</span>
    </div>
  );
};
