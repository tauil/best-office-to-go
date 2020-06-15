import { useState, useEffect, useCallback } from "react";
import { format, fromUnixTime } from 'date-fns'

import useRequestOfficeWeather from "./useRequestOfficeWeather";
import useRequestOfficeFlights from "./useRequestOfficeFlights";
import { Flight, FlightsByCity } from "./useRequestOfficeFlights";

type DailyForecast = any;

export interface FinalResult {
  location: string;
  isCurrentLocation: boolean;
  results: OfficeResults;
}

export interface OfficeResults {
  date: string;
  day: {
    text: string;
    icon: string;
  };
  night: {
    text: string;
    icon: string;
  };
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
  {
    result: FinalResult[] | null,
    loading: boolean,
    loadingForecast: boolean,
    loadingFlights: boolean,
    error: Error | null,
  }
];

const initialState: HookState = {
  result: null,
  loading: false,
  error: null,
};

function useBestOffice(): HookReturn {
  const [ { result, loading, error }, setResult ] = useState(initialState);

  const [ requestForecast, { data: forecast, loading: loadingForecast } ] = useRequestOfficeWeather();
  const [ requestFlights, { data: flights, currentLocation, loading: loadingFlights } ] = useRequestOfficeFlights();

  async function loadForecast() {
    if (!loadingForecast) {
      await requestForecast();
    }
  }

  async function loadFlights(max_stops: number) {
    if (!loadingFlights) {
      await requestFlights(max_stops);
    }
  }

  // Saving time here. I should create types for this
  const processResultByOfficeCallback = useCallback(
    function processResultByOffice(forecastByCity: DailyForecast, flightsByCity: any): OfficeResults {
      return forecastByCity.map((forecast: any) => {
        const date = format(fromUnixTime(forecast.EpochDate), "dd/MM/yyyy");
        const flightsByDate = flightsByCity.filter((flight: any) => flight.date === date);
        const { Maximum, Minimum } = forecast.Temperature;

        return {
          date: date,
          day: {
            text: forecast.Day.IconPhrase,
            icon: forecast.Day.Icon,
          },
          night: {
            text: forecast.Night.IconPhrase,
            icon: forecast.Night.Icon,
          },
          temperature: {
            minimum: Minimum.Value,
            maximum: Maximum.Value,
            unit: Maximum.Unit,
          },
          flights: flightsByDate,
        }
      })
    },
    []
  );

  const mapResultByOfficeCallback = useCallback(
    function mapResultByOffice(officeName: string, forecast: DailyForecast[], flights: FlightsByCity[]) {
      const forecastByCity = forecast.filter((f: DailyForecast) => f.location === officeName)[0].forecast.DailyForecasts;
      const flightsByCity = flights.filter((flight: FlightsByCity) => flight.location === officeName)[0].flights;
      const processedResultsByOffice = processResultByOfficeCallback(forecastByCity, flightsByCity);
      const isCurrentLocation = currentLocation ? (currentLocation.toLowerCase() === officeName.toLowerCase()) : false;

      return {
        location: officeName,
        results: processedResultsByOffice,
        isCurrentLocation,
      }
    },
    [processResultByOfficeCallback, currentLocation]
  );

  useEffect(
    function processWeatherAndFlights() {
      if (forecast && flights) {
        const finalResult: FinalResult[] = ["Amsterdam", "Budapest", "Madrid"].map((officeName: string) => mapResultByOfficeCallback(officeName, forecast, flights));

        setResult((prevState) => ({
          ...prevState,
          result: finalResult,
          loading: false,
        }));
      }
    },
    [mapResultByOfficeCallback, currentLocation, forecast, flights]
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

  return [request, { result, loading, loadingFlights, loadingForecast, error }];
}

export default useBestOffice;
