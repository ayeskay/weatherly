import { CloudRain, Droplets } from 'lucide-react';
import { type WeatherData } from '../utils/weatherApi';
import './PrecipitationCard.css';

interface Props {
  data: WeatherData;
}

export const PrecipitationCard = ({ data }: Props) => {
  const chance = Math.round(data.highlights.todayPrecipChance);
  const total = data.highlights.todayPrecipTotal.toFixed(1);
  const current = data.current.precipitation.toFixed(1);

  return (
    <section className="precip-card glass panel">
      <h3 className="panel-title">Rain Outlook</h3>
      <div className="precip-grid">
        <div className="precip-metric">
          <CloudRain size={18} />
          <span>Chance</span>
          <strong>{chance}%</strong>
        </div>
        <div className="precip-metric">
          <Droplets size={18} />
          <span>Today Total</span>
          <strong>{total} mm</strong>
        </div>
      </div>
      <p className="precip-now">Current intensity: {current} mm/h</p>
    </section>
  );
};
