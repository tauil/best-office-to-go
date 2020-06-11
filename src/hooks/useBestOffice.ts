import { useState, useEffect } from "react";

import { useRequestOfficeWeather } from "./useRequestApi";

interface BestOfficeState {
  result: any | null, // TODO
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

  const [requestForecast, { data: forecast, loading: loadingForecast, error: errorForecast }] = useRequestOfficeWeather([]);

  useEffect(
    function requestLatLong() {
      navigator.geolocation.getCurrentPosition(function(a){console.log(a)})
    },
    []
  );

  useEffect(
    function loadForecast() {
      if (!forecast && !loadingForecast && !errorForecast) {
        requestForecast();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [forecast, loadingForecast, errorForecast]
  );

  console.log(forecast);

  function request() {
    try {
      setResult((prevState) => ({
        ...prevState,
        loading: true,
      }));

      //const response: any | null = await apiRequest(...args);
      // 1. Get weather from 3 cities
      // 2. Get lat long
      // 3. Get local airport
      // 4. Get flights for good days
      // 5. If 1 day with  more than 1 city with good weather, compare flight prices and show the best
      console.log("Started");

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

  return [request, { result, loading, error }];
}

export default useBestOffice;
