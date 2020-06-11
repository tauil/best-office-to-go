import { useState } from "react";

import { getCityFiveDaysForecast } from "../services/weather-api";

export const AMSTERDAM = 249758;
export const MADRID = 308526;
export const BUDAPEST = 187423;

// The Promise and AxiosResponse content should be specific the endpoint. Skipping just to sabe time for now
type ApiRequest = () => Promise<any>;

interface ApiRequestHookState {
  loading: boolean;
  error: Error | null;
  data: any | null,
}

type ApiRequestHookReturn = [
  ApiRequest,
  ApiRequestHookState,
];

const initialState: ApiRequestHookState = {
  loading: false,
  error: null,
  data: null,
};

// Possible improvement: This could get an array of desirable cities to gether the weather
export function useRequestOfficeWeather(): ApiRequestHookReturn {
  const [{ data, loading, error }, setReturn] = useState(initialState);

  async function request() {
    try {
      setReturn((prevState) => ({
        ...prevState,
        loading: true,
      }));

      const responseAms: any | null = await getCityFiveDaysForecast(AMSTERDAM);
      const responseMad: any | null = await getCityFiveDaysForecast(MADRID);
      const responseBud: any | null = await getCityFiveDaysForecast(BUDAPEST);

      setReturn((prevState) => ({
        ...prevState,
        data: {
          amsterdam: responseAms.data,
          madrid: responseMad.data,
          budapest: responseBud.data,
        },
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
