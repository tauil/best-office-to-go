import { useState } from "react";
import { add, format, fromUnixTime } from 'date-fns'

import { getFlightsFrom, getLocalAirport } from "../services/flights-api";

type FlightResponse = any;

export interface Flight {
  id: string;
  date: string;
  price: number;
  duration: string;
  deepLink: string;
  availability: {
    seats: number;
  };
  stops: number;
};

// The Promise and AxiosResponse content should be specific the endpoint. Skipping just to sabe time for now
type ApiRequest = (max_stops: number) => Promise<any>;

export interface FlightsByCity {
  location: string;
  flights: Flight[];
};

interface ApiRequestHookState {
  loading: boolean;
  data: FlightsByCity[] | null;
  currentLocation: string | null;
}

type ApiRequestHookReturn = [
  ApiRequest,
  ApiRequestHookState,
];

const initialState: ApiRequestHookState = {
  loading: false,
  data: null,
  currentLocation: null,
};

function useRequestOfficeFlights(): ApiRequestHookReturn {
  const [{ data, currentLocation, loading }, setReturn] = useState(initialState);

  async function requestLatLong(): Promise<{ latitude: number, longitude: number }> {
    return new Promise(resolve => {
      navigator.geolocation.getCurrentPosition(function({ coords }: any){
        const { latitude, longitude } = coords;
        resolve({ latitude, longitude });
      })
    });
  }

  function findFlights(currentLocationCode: string, max_stops: number): Promise<FlightsByCity>[] {
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
        const flightsResponse = await getFlightsFrom(currentLocationCode, code, startDateParameter, endDateParameter, max_stops);
        onlyFlightsResponseData = flightsResponse.data.data;
      }

      const flightsFound = onlyFlightsResponseData
        .filter((flight: any) => flight.availability.seats !== null)
        .map(({
          id,
          dTime,
          price,
          fly_duration,
          availability,
          deep_link,
          route,
        }: FlightResponse): Flight => ({
          id,
          date: format(fromUnixTime(dTime), "dd/MM/yyyy"),
          price,
          duration: fly_duration,
          availability,
          deepLink: deep_link,
          stops: route.length - 1,
        }));

      return { location: city, flights: flightsFound };
    });
  }

  async function request(max_stops: number) {
    setReturn((prevState) => ({
      ...prevState,
      loading: true,
    }));

    const coords = await requestLatLong();
    const currentLocationAirports: any = await getLocalAirport(coords.latitude, coords.longitude);

    // TODO: Manage error
    const { data: { locations } } = currentLocationAirports;
    const currentLocationAirport = locations[0];

    const flights = await Promise.all(findFlights(currentLocationAirport.code, max_stops))

    setReturn((prevState) => ({
      ...prevState,
      currentLocation: currentLocationAirport.city.name,
      data: flights,
      loading: false,
    }));
  }

  return [request, { data, currentLocation, loading }];
}

export default useRequestOfficeFlights;
