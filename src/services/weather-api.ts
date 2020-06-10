import axios from "axios";

const API_URL = "http://dataservice.accuweather.com";
const DEFAULT_PARAMS = {
  params: {
    apikey: process.env.REACT_APP_WEATHER_API_KEY,
    metric: true,
  }
};

const weatherApiClient = axios.create({
  baseURL: API_URL,
  headers: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "Content-type": "application/json; charset=UTF-8",
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Accept: "application/json",
  },
});

export const getCityFiveDaysForecast = (cityId: number) =>
  weatherApiClient.get<any>(`/forecasts/v1/daily/5day/${cityId}`, DEFAULT_PARAMS);
