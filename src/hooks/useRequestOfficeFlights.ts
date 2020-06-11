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

  const requestLatLongCallback = useCallback(
    async function requestLatLong() {
      setReturn((prevState) => ({
        ...prevState,
        loading: true,
      }));

      navigator.geolocation.getCurrentPosition(function({ coords }: any){
        const { latitude, longitude } = coords;
        console.log({latitude});
        setReturn((prevState) => ({
          ...prevState,
          loading: false,
          lat: latitude,
          long: longitude,
        }));
      })
    },
    []
  );

  async function request() {
    try {
      setReturn((prevState) => ({
        ...prevState,
        loading: true,
      }));

      console.log("Requesting flights...");
      // TODO: Pass lat / long
      await requestLatLongCallback();
      const currentLocationAirports: any | null = await getLocalAirport();
      console.log({a: currentLocationAirports});
      const { data: { locations } } = currentLocationAirports;
      // TODO: Investigate why lat, long is not loading here
      console.log({lat, long, locations});
      const currentLocationAirport = locations[0];
      const flightsToMad: any | null = await getFlightsFrom(currentLocationAirport.code, "MAD", "18/11/2020", "12/12/2020");
      const { data } = flightsToMad;
      console.log({loadedFlights: data});

      setReturn((prevState) => ({
        ...prevState,
        data: data.data, // Unfortune coincidence...
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
