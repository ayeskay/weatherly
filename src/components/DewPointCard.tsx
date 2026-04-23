import { Droplets } from 'lucide-react';
import { type WeatherData } from '../utils/weatherApi';
import './FeatureCard.css';

interface Props {
  data: WeatherData;
}

const getDewPointComfort = (dewPoint: number) => {
  if (dewPoint < 10) return 'Dry & crisp';
  if (dewPoint < 16) return 'Comfortable';
  if (dewPoint < 21) return 'Slightly muggy';
  return 'Oppressive';
};

export const DewPointCard = ({ data }: Props) => {
  const dew = Math.round(data.current.dew_point);
  const comfort = getDewPointComfort(data.current.dew_point);

  return (
    <div className="feature-card glass panel">
      <div className="feature-card__icon">
        <Droplets size={22} />
      </div>
      <span className="feature-card__label">Dew Point</span>
      <strong className="feature-card__value">{dew}°</strong>
      <span className="feature-card__hint">{comfort}</span>
    </div>
  );
};
