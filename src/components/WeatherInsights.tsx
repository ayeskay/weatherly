import { type WeatherData } from '../utils/weatherApi';
import './WeatherInsights.css';

interface Props {
  data: WeatherData;
}

export const WeatherInsights = ({ data }: Props) => {
  const insights = [
    data.highlights.todayPrecipChance >= 60
      ? 'Carry umbrella. Rain probability high today.'
      : 'Low rain risk. Good window for outdoor plans.',
    data.highlights.currentUv >= 6
      ? 'UV elevated. Sunscreen and shade recommended.'
      : 'UV manageable right now. Comfortable exposure window.',
    data.current.windspeed >= 25
      ? 'Winds strong. Lightweight outdoor setups may shift.'
      : 'Wind conditions mostly steady for commuting.',
  ];

  return (
    <section className="insights-card glass panel">
      <h3 className="panel-title">Weather Insights</h3>
      <ul>
        {insights.map((insight) => (
          <li key={insight}>{insight}</li>
        ))}
      </ul>
    </section>
  );
};
