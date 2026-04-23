export const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
    const response = await fetch(url, {
      headers: {
        'Accept-Language': 'en-US,en;q=0.9',
        'User-Agent': 'WeatherlyApp/1.0'
      }
    });
    
    if (!response.ok) return 'Unknown Location';
    
    const data = await response.json();
    
    // Nominatim returns different levels of detail
    const city = data.address.city || data.address.town || data.address.village || data.address.suburb || data.address.county || 'Unknown Location';
    return city;
  } catch (error) {
    console.error("Geocoding error", error);
    return 'Locating...';
  }
};
