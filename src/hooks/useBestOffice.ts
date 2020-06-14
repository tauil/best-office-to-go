import { useState, useCallback, useEffect } from "react";

import useRequestOfficeWeather from "./useRequestOfficeWeather";
import useRequestOfficeFlights from "./useRequestOfficeFlights";

// TODO: Define type properly
type OfficeResult = any;

interface BestOfficeState {
  result: OfficeResult[] | null,
  loading: boolean,
  error: Error | null,
}

type BestOfficeReturn = [
  () => void,
  BestOfficeState
];

const mockedResult = [
  {
    location: "Madrid",
    weather: {
      temperature: { min: 18, max: 23 },
      conditions: "Clear",
    },
    bestOffice: true,
  },
  {
    location: "Amsterdam",
    weather: {
      temperature: { min: 8, max: 18 },
      conditions: "Cloudy",
    },
    bestOffice: false,
  },
  {
    location: "Budapest",
    weather: {
      temperature: { min: 10, max: 15 },
      conditions: "Rainy",
    },
    bestOffice: false,
  },
];

const initialState: BestOfficeState = {
  result: null,
  loading: false,
  error: null,
};

function useBestOffice(): BestOfficeReturn {
  const [ { result, loading, error }, setResult ] = useState(initialState);

  const [ requestForecast, { data: forecast, loading: loadingForecast, error: errorForecast } ] = useRequestOfficeWeather();
  const [ requestFlights, { data: flights, loading: loadingFlights, error: errorFlights } ] = useRequestOfficeFlights();

  const forecastRequestCallback = useCallback(
    function loadForecast() {
      if (!forecast && !loadingForecast && !errorForecast) {
        requestForecast();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [forecast, loadingForecast, errorForecast]
  );

  const flightsRequestCallback = useCallback(
    function loadFlights() {
      if (!flights && !loadingFlights && !errorForecast) {
        requestFlights();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [flights, loadingFlights, errorFlights]
  );

  useEffect(
    function processWeatherAndFlights() {
      if (forecast && flights) {
        console.log({forecast, flights});
      }
    },
    [forecast, flights]
  );

  function request() {
    try {
      setResult((prevState) => ({
        ...prevState,
        loading: true,
      }));

      // 1. (DONE) Get weather from 3 cities
      // 2. (DONE) Get lat long
      // 3. (DONE) Get local airport
      // 4. Get flights for good days
      // 5. If 1 day with  more than 1 city with good weather, compare flight prices and show the best
      forecastRequestCallback();
      flightsRequestCallback();

      setResult((prevState) => ({
        ...prevState,
        result: mockedResult,
        loading: false,
      }));
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
