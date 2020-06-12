import { useState, useCallback } from "react";

import { getFlightsFrom, getLocalAirport } from "../services/flights-api";

// The Promise and AxiosResponse content should be specific the endpoint. Skipping just to sabe time for now
type ApiRequest = () => Promise<any>;

interface ApiRequestHookState {
  loading: boolean;
  error: Error | null;
  data: any | null,
  lat: string | null,
  long: string | null,
}

type ApiRequestHookReturn = [
  ApiRequest,
  {
    loading: boolean;
    error: Error | null;
    data: any | null,
  }
];

const initialState: ApiRequestHookState = {
  loading: false,
  error: null,
  data: null,
  lat: null,
  long: null,
};

function useRequestOfficeFlights(): ApiRequestHookReturn {
  const [{ data, loading, error, lat, long }, setReturn] = useState(initialState);

  async function requestLatLong(): Promise<{ latitude: number, longitude: number }> {
    return new Promise(resolve => {
      navigator.geolocation.getCurrentPosition(function({ coords }: any){
        const { latitude, longitude } = coords;
        resolve({ latitude, longitude });
      })
    });
  }

  async function requestFlights(lat: number, long: number) {
    const currentLocationAirports: any | null = await getLocalAirport(lat, long);

    // TODO: Manage error
    const { data: { locations } } = currentLocationAirports;
    const currentLocationAirport = locations[0];

    const flightsToMad: any | null = await getFlightsFrom(currentLocationAirport.code, "MAD", "18/11/2020", "12/12/2020");

    return flightsToMad.data;
  }

  async function request() {
    try {
      setReturn((prevState) => ({
        ...prevState,
        loading: true,
      }));

      const coords = await requestLatLong();
      const flights = await requestFlights(coords.latitude, coords.longitude);

      setReturn((prevState) => ({
        ...prevState,
        data: flights,
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

export default useRequestOfficeFlights;
