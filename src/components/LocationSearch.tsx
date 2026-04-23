import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation } from 'lucide-react';
import { searchLocations, type LocationResult } from '../utils/geoApi';
import './LocationSearch.css';

interface Props {
  onSelectLocation: (lat: number, lon: number, name: string) => void;
  onSelectCurrentLocation: () => void;
}

export const LocationSearch = ({ onSelectLocation, onSelectCurrentLocation }: Props) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setLoading(true);
        const searchResults = await searchLocations(query);
        setResults(searchResults);
        setLoading(false);
        setIsOpen(true);
      } else {
        setResults([]);
        setIsOpen(query.length > 0);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectResult = (result: LocationResult) => {
    onSelectLocation(result.latitude, result.longitude, result.name);
    setQuery('');
    setIsOpen(false);
  };

  const handleSelectCurrent = () => {
    onSelectCurrentLocation();
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="location-search" ref={dropdownRef}>
      <div className="search-input-wrapper">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          placeholder="Search city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
        />
        {loading && <div className="search-spinner"></div>}
      </div>

      {isOpen && (
        <div className="search-dropdown glass">
          <button className="search-result-item current-location" onClick={handleSelectCurrent}>
            <Navigation size={16} />
            <div className="result-text">
              <strong>Current Location</strong>
              <span>Use your device GPS</span>
            </div>
          </button>

          {results.map((result, index) => (
            <button
              key={`${result.latitude}-${result.longitude}-${index}`}
              className="search-result-item"
              onClick={() => handleSelectResult(result)}
            >
              <MapPin size={16} />
              <div className="result-text">
                <strong>{result.name}</strong>
                <span>
                  {result.admin1 ? `${result.admin1}, ` : ''}
                  {result.country}
                </span>
              </div>
            </button>
          ))}

          {query.length >= 2 && results.length === 0 && !loading && (
            <div className="search-no-results">No cities found</div>
          )}
        </div>
      )}
    </div>
  );
};
