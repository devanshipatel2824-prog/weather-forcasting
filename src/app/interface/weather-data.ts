export interface WeatherData {
  weatherId?: string;
  stationId: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainfall: number;
  pressure: number;
  dateTime: string;
}