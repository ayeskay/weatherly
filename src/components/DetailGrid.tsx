import { type WeatherData } from '../utils/weatherApi';
import { Droplets, Wind, Sun, Gauge } from 'lucide-react';
import './DetailGrid.css';

interface Props {
  data: WeatherData;
}

export const DetailGrid = ({ data }: Props) => {
  const currentUV = data.highlights.currentUv;

  return (
    <div className="detail-grid">
      <div className="detail-card glass">
        <div className="detail-header">
          <Droplets size={18} />
          <span>Humidity</span>
        </div>
        <h2>{data.current.relative_humidity}%</h2>
      </div>

      <div className="detail-card glass">
        <div className="detail-header">
          <Wind size={18} />
          <span>Wind</span>
        </div>
        <h2>{Math.round(data.current.windspeed)} km/h</h2>
      </div>

      <div className="detail-card glass">
        <div className="detail-header">
          <Sun size={18} />
          <span>UV Index</span>
        </div>
        <h2>{currentUV.toFixed(1)}</h2>
      </div>

      <div className="detail-card glass">
        <div className="detail-header">
          <Gauge size={18} />
          <span>Wind Gusts</span>
        </div>
        <h2>{Math.round(data.current.wind_gusts)} km/h</h2>
      </div>
    </div>
  );
};
