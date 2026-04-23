import { useState, useEffect } from 'react';

interface GeolocationState {
  coordinates: { lat: number; lon: number } | null;
  error: string | null;
  loading: boolean;
  isFallback: boolean;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    error: null,
    loading: true,
    isFallback: false,
  });

  useEffect(() => {
    const fetchIpLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) throw new Error('IP location failed');
        const data = await response.json();
        
        setState({
          coordinates: { lat: data.latitude, lon: data.longitude },
          error: null,
          loading: false,
          isFallback: true,
        });
      } catch {
        setState({
          coordinates: null,
          error: 'Failed to access device location and IP location fallback.',
          loading: false,
          isFallback: false,
        });
      }
    };

    if (!navigator.geolocation) {
      fetchIpLocation();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          coordinates: {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          },
          error: null,
          loading: false,
          isFallback: false,
        });
      },
      () => {
        // Fallback gracefully on denial or error
        fetchIpLocation();
      }
    );
  }, []);

  return state;
};
