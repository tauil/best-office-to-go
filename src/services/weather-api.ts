import axios from "axios";

import { axiosSetup } from "./api";

const API_URL = "https://dataservice.accuweather.com";
const DEFAULT_PARAMS = {
  params: {
    apikey: process.env.REACT_APP_WEATHER_API_KEY,
    metric: true,
  }
};

const apiClient = axios.create(axiosSetup(API_URL));

export const getCityFiveDaysForecast = (cityId: number) =>
  apiClient.get<any>(`/forecasts/v1/daily/5day/${cityId}`, DEFAULT_PARAMS);
