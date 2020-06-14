import { useState } from "react";
import { add, format } from 'date-fns'

import { getFlightsFrom, getLocalAirport } from "../services/flights-api";

// The Promise and AxiosResponse content should be specific the endpoint. Skipping just to sabe time for now
type ApiRequest = () => Promise<any>;

interface ApiRequestHookState {
  loading: boolean;
  error: Error | null;
  data: any | null,
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
};

function useRequestOfficeFlights(): ApiRequestHookReturn {
  const [{ data, loading, error }, setReturn] = useState(initialState);

  async function requestLatLong(): Promise<{ latitude: number, longitude: number }> {
    return new Promise(resolve => {
      navigator.geolocation.getCurrentPosition(function({ coords }: any){
        const { latitude, longitude } = coords;
        resolve({ latitude, longitude });
      })
    });
  }

  function requestFlights(currentLocationCode: string) {
    const citiesToBeSearched = [
      { city: "Amsterdam", code: "AMS" },
      { city: "Madrid", code: "MAD" },
      { city: "Budapest", code: "BUD" },
    ];

    // This could be improved my avoiding the mutation of the variable flightsToCity. I'm not doing it now to save time.
    return citiesToBeSearched.map(async ({ city, code }) => {
      let onlyFlightsResponseData = [];
      const startDate = new Date();
      const startDateParameter = format(startDate, "dd/MM/yyyy");
      const endDate = add(startDate, { days: 4 });
      const endDateParameter = format(endDate, "dd/MM/yyyy");

      if (currentLocationCode !== code) {
        const flightsResponse = await getFlightsFrom(currentLocationCode, code, startDateParameter, endDateParameter);
        onlyFlightsResponseData = flightsResponse.data.data;
      }

      const flightsFound = onlyFlightsResponseData
        .filter((flight: any) => flight.availability.seats !== null)
        .map(({ dTime, price, duration, availability }: any) => ({ dTime, price, duration, availability }));

      return { location: city, flights: flightsFound };
    });
  }

  async function process(lat: number, long: number) {
    const currentLocationAirports: any | null = await getLocalAirport(lat, long);

    // TODO: Manage error
    const { data: { locations } } = currentLocationAirports;
    const currentLocationAirport = locations[0];

    const flights = await Promise.all(requestFlights(currentLocationAirport.code));

    return flights;
  }

  async function request() {
    try {
      setReturn((prevState) => ({
        ...prevState,
        loading: true,
      }));

      const coords = await requestLatLong();
      const flights = await process(coords.latitude, coords.longitude);

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
