import { Thermometer, Wind } from 'lucide-react';
import { type WeatherData } from '../utils/weatherApi';
import './ComfortIndexCard.css';

interface Props {
  data: WeatherData;
}

export const ComfortIndexCard = ({ data }: Props) => {
  return (
    <section className="comfort-card glass panel">
      <h3 className="panel-title">Comfort Index</h3>
      <div className="comfort-score">
        <span>Outdoor Score</span>
        <strong>{data.comfort.outdoorScore}/100</strong>
      </div>
      <div className="comfort-grid">
        <div>
          <Thermometer size={16} />
          <span>Feels like {Math.round(data.comfort.feelsLike)}°</span>
        </div>
        <div>
          <Wind size={16} />
          <span>{data.comfort.humidityBand} humidity</span>
        </div>
      </div>
      <p className="comfort-hydration">{data.comfort.hydrationHint}</p>
    </section>
  );
};
