import { useState } from "react";
import { AxiosResponse } from "axios";

import { getCityFiveDaysForecast } from "../services/weather-api";

export const AMSTERDAM = 249758;
export const MADRID = 308526;
export const BUDAPEST = 187423;

// The response could be specific for each endpoint
type ApiRequest = (...args: any) => Promise<AxiosResponse<any>>;

interface ApiRequestHookState {
  loading: boolean;
  error: Error | null;
  data: any | null,
}

type ApiRequestHookReturn = [
  (cityId: number) => void,
  ApiRequestHookState,
];

const initialState: ApiRequestHookState = {
  loading: false,
  error: null,
  data: null,
};

function useRequestApi(apiRequest: ApiRequest): ApiRequestHookReturn {
  const [{ data, loading, error }, setReturn] = useState(initialState);

  async function request(...args: any) {
    try {
      setReturn((prevState) => ({
        ...prevState,
        loading: true,
      }));
      const response: any | null = await apiRequest(...args);
      setReturn((prevState) => ({
        ...prevState,
        data: response.data,
        loading: false,
      }));
    } catch (error) {
      setReturn((prevState) => ({
        ...prevState,
        error: error,
        loading: false,
      }));
    }
  }

  return [request, { data, loading, error }];
}

export function useRequestWeatherApi() {
  return useRequestApi(getCityFiveDaysForecast);
}
