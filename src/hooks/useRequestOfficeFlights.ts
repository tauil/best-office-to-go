import { useState } from "react";
import { add, format, fromUnixTime } from 'date-fns'

import { getFlightsFrom, getLocalAirport } from "../services/flights-api";

type FlightResponse = any;

export interface Flight {
  id: string;
  date: string;
  price: number;
  duration: {
    departure: number;
    return: number;
    total: number;
  };
  deepLink: string;
  availability: {
    seats: number;
  };
};

// The Promise and AxiosResponse content should be specific the endpoint. Skipping just to sabe time for now
type ApiRequest = (max_stops: number) => Promise<any>;

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

  function findFlights(currentLocationCode: string, max_stops: number) {
    const citiesToBeSearched = [
      { city: "Amsterdam", code: "AMS" },
      { city: "Madrid", code: "MAD" },
      { city: "Budapest", code: "BUD" },
    ];

    // This could be improved my avoiding the mutation of the variable flightsToCity. I'm not doing it now to save time.
    return citiesToBeSearched.map(async ({ city, code }) => {
      let onlyFlightsResponseData = [];

      // TODO
      const startDate = new Date();
      const startDateParameter = format(startDate, "dd/MM/yyyy");
      const endDate = add(startDate, { days: 4 });
      const endDateParameter = format(endDate, "dd/MM/yyyy");

      if (currentLocationCode !== code) {
        console.log("Request for", code, max_stops);
        const flightsResponse = await getFlightsFrom(currentLocationCode, code, startDateParameter, endDateParameter, max_stops);
        onlyFlightsResponseData = flightsResponse.data.data;
      }

      console.log(onlyFlightsResponseData);

      const flightsFound = onlyFlightsResponseData
        .filter((flight: any) => flight.availability.seats !== null)
        .map(({
          id,
          dTime,
          price,
          duration,
          availability,
          deep_link,
        }: FlightResponse) => ({
          id,
          date: format(fromUnixTime(dTime), "dd/MM/yyyy"),
          price,
          duration,
          availability,
          deepLink: deep_link,
        }));

      return { location: city, flights: flightsFound };
    });
  }

  async function request(max_stops: number) {
    try {
      setReturn((prevState) => ({
        ...prevState,
        loading: true,
      }));

      const coords = await requestLatLong();
      const currentLocationAirports: any | null = await getLocalAirport(coords.latitude, coords.longitude);

      // TODO: Manage error
      const { data: { locations } } = currentLocationAirports;
      const currentLocationAirport = locations[0];

      console.log("Request flights", max_stops);

      const flights = await Promise.all(findFlights(currentLocationAirport.code, max_stops))

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
