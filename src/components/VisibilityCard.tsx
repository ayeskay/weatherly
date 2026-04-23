import { Eye } from 'lucide-react';
import { type WeatherData } from '../utils/weatherApi';
import './FeatureCard.css';

interface Props {
  data: WeatherData;
}

const getVisibilityLabel = (meters: number) => {
  const km = meters / 1000;
  if (km >= 10) return 'Excellent';
  if (km >= 5) return 'Good';
  if (km >= 2) return 'Moderate';
  if (km >= 1) return 'Poor';
  return 'Very Poor';
};

export const VisibilityCard = ({ data }: Props) => {
  const km = (data.current.visibility / 1000).toFixed(1);
  const label = getVisibilityLabel(data.current.visibility);

  return (
    <div className="feature-card glass panel">
      <div className="feature-card__icon">
        <Eye size={22} />
      </div>
      <span className="feature-card__label">Visibility</span>
      <strong className="feature-card__value">{km} km</strong>
      <span className="feature-card__hint">{label}</span>
    </div>
  );
};
