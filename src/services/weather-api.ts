import axios from "axios";

const API_URL = "https://dataservice.accuweather.com";
const DEFAULT_PARAMS = {
  params: {
    apikey: process.env.REACT_APP_WEATHER_API_KEY,
    metric: true,
  }
};

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "Content-type": "application/json; charset=UTF-8",
  },
});

export const getCityFiveDaysForecast = (cityId: number) =>
  apiClient.get<any>(`/forecasts/v1/daily/5day/${cityId}`, DEFAULT_PARAMS);
