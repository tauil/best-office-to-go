import { useState, useEffect } from "react";

import { AMSTERDAM, MADRID, BUDAPEST, useRequestWeatherApi } from "./useRequestApi";

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

  const [requestAmsterdamForecast, { data: amsForecast, loading: amsForecastLoading, error: amsForecastError }] = useRequestWeatherApi();
  const [requestMadridForecast, { data: madForecast, loading: madForecastLoading, error: madForecastError }] = useRequestWeatherApi();
  const [requestBudapestForecast, { data: budForecast, loading: budForecastLoading, error: budForecastError }] = useRequestWeatherApi();

  useEffect(
    function requestLatLong() {
      navigator.geolocation.getCurrentPosition(function(a){console.log(a)})
    },
    []
  );

  useEffect(
    function loadAmsterdamForecast() {
      if (!amsForecast && !amsForecastLoading && !amsForecastError) {
        requestAmsterdamForecast(AMSTERDAM);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [amsForecast, amsForecastLoading, amsForecastError]
  );

  useEffect(
    function loadMadridForecast() {
      if (!madForecast && !madForecastLoading && !madForecastError) {
        requestMadridForecast(MADRID);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [madForecast, madForecastLoading, madForecastError]
  );

  useEffect(
    function loadBudapestForecast() {
      if (!budForecast && !budForecastLoading && !budForecastError) {
        requestBudapestForecast(BUDAPEST);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [budForecast, budForecastLoading, budForecastError]
  );

  console.log(amsForecast);
  console.log(madForecast);
  console.log(budForecast);

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
