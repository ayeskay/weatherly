import { Compass } from 'lucide-react';
import { type WeatherData } from '../utils/weatherApi';
import './FeatureCard.css';

interface Props {
  data: WeatherData;
}

const getCardinalDirection = (deg: number) => {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
};

export const WindDirectionCard = ({ data }: Props) => {
  const deg = Math.round(data.current.wind_direction);
  const cardinal = getCardinalDirection(data.current.wind_direction);

  return (
    <div className="feature-card glass panel">
      <div className="feature-card__icon" style={{ transform: `rotate(${deg}deg)` }}>
        <Compass size={22} />
      </div>
      <span className="feature-card__label">Wind Direction</span>
      <strong className="feature-card__value">{cardinal}</strong>
      <span className="feature-card__hint">{deg}°</span>
    </div>
  );
};
