import { useState, useEffect } from "react";
import { format, fromUnixTime } from 'date-fns'

import useRequestOfficeWeather from "./useRequestOfficeWeather";
import useRequestOfficeFlights from "./useRequestOfficeFlights";
import { Flight } from "./useRequestOfficeFlights";

export interface FinalResult {
  location: string;
  isCurrentLocation: boolean;
  results: OfficeResults;
}

export interface OfficeResults {
  date: string;
  day: string;
  night: string;
  temperature: {
    minimum: number,
    maximum: number,
    unit: string,
  };
  flights: Flight[];
};

interface HookState {
  result: FinalResult[] | null,
  loading: boolean,
  error: Error | null,
}

type HookReturn = [
  (max_stops: number) => void,
  HookState
];

const initialState: HookState = {
  result: null,
  loading: false,
  error: null,
};

function useBestOffice(): HookReturn {
  const [ { result, loading, error }, setResult ] = useState(initialState);

  const [ requestForecast, { data: forecast, loading: loadingForecast, error: errorForecast } ] = useRequestOfficeWeather();
  const [ requestFlights, { data: flights, currentLocation, loading: loadingFlights, error: errorFlights } ] = useRequestOfficeFlights();

  async function loadForecast() {
    if (!loadingForecast && !errorForecast) {
      await requestForecast();
    }
  }

  async function loadFlights(max_stops: number) {
    if (!loadingFlights && !errorFlights) {
      await requestFlights(max_stops);
    }
  }

  useEffect(
    function processWeatherAndFlights() {
      if (forecast && flights) {
        const finalResult: FinalResult[] = ["Amsterdam", "Budapest", "Madrid"].map((officeName: string) => {
          const forecastByCity = forecast.filter((f: any) => f.location === officeName)[0].forecast.DailyForecasts;
          const flightsByCity = flights.filter((flight: any) => flight.location === officeName)[0].flights;

          const processedResults = forecastByCity.map((forecast: any) => {
            const date = format(fromUnixTime(forecast.EpochDate), "dd/MM/yyyy");
            const flightsByDate = flightsByCity.filter((flight: any) => flight.date === date);
            const { Maximum, Minimum } = forecast.Temperature;

            return {
              date: date,
              day: forecast.Day.IconPhrase,
              night: forecast.Night.IconPhrase,
              temperature: {
                minimum: Minimum.Value,
                maximum: Maximum.Value,
                unit: Maximum.Unit,
              },
              flights: flightsByDate,
            }
          });

          const isCurrentLocation = currentLocation ? (currentLocation.toLowerCase() === officeName.toLowerCase()) : false;

          return {
            location: officeName,
            results: processedResults,
            isCurrentLocation,
          }
        });

        setResult((prevState) => ({
          ...prevState,
          result: finalResult,
          loading: false,
        }));
      }
    },
    [currentLocation, forecast, flights]
  );

  async function request(max_stops: number) {
    try {
      setResult((prevState) => ({
        ...prevState,
        loading: true,
      }));

      await loadForecast();
      await loadFlights(max_stops);
    } catch (error) {
      setResult((prevState) => ({
        ...prevState,
        error: error,
        loading: false,
      }));
    }
  }

  return [request, { result, loading: (loading || loadingFlights || loadingForecast), error }];
}

export default useBestOffice;
