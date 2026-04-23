export interface WeatherData {
  current: {
    temperature: number;
    apparent_temperature: number;
    relative_humidity: number;
    windspeed: number;
    wind_gusts: number;
    precipitation: number;
    weathercode: number;
    is_day: number;
    time: string;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    apparent_temperature: number[];
    weather_code: number[];
    relative_humidity_2m: number[];
    uv_index: number[];
    precipitation_probability: number[];
    precipitation: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weathercode: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
    precipitation_probability_max: number[];
    precipitation_sum: number[];
    wind_speed_10m_max: number[];
  };
  aqi?: number;
  highlights: {
    currentUv: number;
    todayUvMax: number;
    todayPrecipChance: number;
    todayPrecipTotal: number;
    todayWindMax: number;
    sunrise: string;
    sunset: string;
  };
  comfort: {
    feelsLike: number;
    humidityBand: 'Dry' | 'Comfortable' | 'Humid';
    outdoorScore: number;
    hydrationHint: string;
  };
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const getCurrentHourIndex = (times: string[], currentTime: string) => {
  const now = new Date(currentTime).getTime();
  const nextHourIndex = times.findIndex((time) => new Date(time).getTime() > now);
  return nextHourIndex > 0 ? nextHourIndex - 1 : 0;
};

const getHumidityBand = (humidity: number): 'Dry' | 'Comfortable' | 'Humid' => {
  if (humidity < 35) return 'Dry';
  if (humidity <= 65) return 'Comfortable';
  return 'Humid';
};

const getHydrationHint = (temperature: number, currentUv: number, humidity: number) => {
  if (currentUv >= 8 || temperature >= 32) return 'High heat or UV. Hydrate often.';
  if (humidity >= 70) return 'Heavy air today. Keep water nearby.';
  return 'Normal hydration pace works.';
};

const getOutdoorScore = (
  feelsLike: number,
  precipChance: number,
  currentUv: number,
  humidity: number
) => {
  let score = 100;
  score -= Math.abs(feelsLike - 22) * 2;
  score -= precipChance * 0.25;
  score -= Math.max(0, currentUv - 6) * 5;
  score -= Math.max(0, humidity - 70) * 0.7;
  return Math.round(clamp(score, 0, 100));
};

export const fetchWeather = async (lat: number, lon: number): Promise<WeatherData> => {
  // Main Weather Endpoint
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,is_day,weather_code,wind_speed_10m,wind_gusts_10m,precipitation&hourly=temperature_2m,apparent_temperature,weather_code,relative_humidity_2m,uv_index,precipitation_probability,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max,precipitation_sum,wind_speed_10m_max&timezone=auto`;
  
  // AQI Endpoint
  const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi&timezone=auto`;

  const [weatherRes, aqiRes] = await Promise.all([
    fetch(weatherUrl),
    fetch(aqiUrl).catch(() => null) // fail gracefully for AQI
  ]);

  if (!weatherRes.ok) {
    throw new Error('Failed to fetch weather data');
  }
  
  const data = await weatherRes.json();
  let aqiData = null;
  
  if (aqiRes && aqiRes.ok) {
    aqiData = await aqiRes.json();
  }
  
  const currentTime = data.current.time as string;
  const hourlyTimes = (data.hourly.time ?? []) as string[];
  const hourlyUv = (data.hourly.uv_index ?? []) as number[];
  const currentHourIndex = getCurrentHourIndex(hourlyTimes, currentTime);
  const currentUv = hourlyUv[currentHourIndex] ?? 0;
  const todayUvMax = data.daily.uv_index_max?.[0] ?? currentUv;
  const todayPrecipChance = data.daily.precipitation_probability_max?.[0] ?? 0;
  const todayPrecipTotal = data.daily.precipitation_sum?.[0] ?? 0;
  const todayWindMax = data.daily.wind_speed_10m_max?.[0] ?? data.current.wind_speed_10m ?? 0;
  const feelsLike = data.current.apparent_temperature ?? data.current.temperature_2m ?? 0;
  const humidity = data.current.relative_humidity_2m ?? 0;

  return {
    current: {
      temperature: data.current.temperature_2m,
      apparent_temperature: data.current.apparent_temperature,
      relative_humidity: data.current.relative_humidity_2m,
      windspeed: data.current.wind_speed_10m,
      wind_gusts: data.current.wind_gusts_10m,
      precipitation: data.current.precipitation,
      weathercode: data.current.weather_code,
      is_day: data.current.is_day,
      time: data.current.time
    },
    hourly: {
      time: data.hourly.time ?? [],
      temperature_2m: data.hourly.temperature_2m ?? [],
      apparent_temperature: data.hourly.apparent_temperature ?? [],
      weather_code: data.hourly.weather_code ?? [],
      relative_humidity_2m: data.hourly.relative_humidity_2m ?? [],
      uv_index: data.hourly.uv_index ?? [],
      precipitation_probability: data.hourly.precipitation_probability ?? [],
      precipitation: data.hourly.precipitation ?? [],
    },
    daily: {
      time: data.daily.time ?? [],
      temperature_2m_max: data.daily.temperature_2m_max ?? [],
      temperature_2m_min: data.daily.temperature_2m_min ?? [],
      weathercode: data.daily.weather_code ?? [],
      sunrise: data.daily.sunrise ?? [],
      sunset: data.daily.sunset ?? [],
      uv_index_max: data.daily.uv_index_max ?? [],
      precipitation_probability_max: data.daily.precipitation_probability_max ?? [],
      precipitation_sum: data.daily.precipitation_sum ?? [],
      wind_speed_10m_max: data.daily.wind_speed_10m_max ?? [],
    },
    aqi: aqiData?.current?.us_aqi,
    highlights: {
      currentUv,
      todayUvMax,
      todayPrecipChance,
      todayPrecipTotal,
      todayWindMax,
      sunrise: data.daily.sunrise?.[0] ?? '',
      sunset: data.daily.sunset?.[0] ?? '',
    },
    comfort: {
      feelsLike,
      humidityBand: getHumidityBand(humidity),
      outdoorScore: getOutdoorScore(feelsLike, todayPrecipChance, currentUv, humidity),
      hydrationHint: getHydrationHint(feelsLike, currentUv, humidity),
    },
  };
};

export const getWeatherDescription = (code: number): string => {
  if (code === 0) return 'Clear sky';
  if (code >= 1 && code <= 3) return 'Partly cloudy';
  if (code >= 45 && code <= 48) return 'Foggy';
  if (code >= 51 && code <= 55) return 'Drizzle';
  if (code >= 61 && code <= 65) return 'Rain';
  if (code >= 71 && code <= 75) return 'Snow';
  if (code >= 80 && code <= 82) return 'Rain showers';
  if (code >= 95 && code <= 99) return 'Thunderstorm';
  return 'Unknown';
}
