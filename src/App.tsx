import React, { useEffect } from 'react';

import { AMSTERDAM, MADRID, BUDAPEST, useRequestWeatherApi } from "./hooks/useRequestApi";

import './App.css';

function App() {
  const [requestAmsterdamForecast, { data: amsForecast, loading: amsForecastLoading, error: amsForecastError }] = useRequestWeatherApi();
  const [requestMadridForecast, { data: madForecast, loading: madForecastLoading, error: madForecastError }] = useRequestWeatherApi();
  const [requestBudapestForecast, { data: budForecast, loading: budForecastLoading, error: budForecastError }] = useRequestWeatherApi();

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

  if (!amsForecast || !madForecast || !budForecast) {
    return (
      <p>Loading...</p>
    );
  }

  const { Headline: { Text: AmsText }, DailyForecasts: amsDailyForecasts } = amsForecast;
  const { Headline: { Text: MadText }, DailyForecasts: madDailyForecasts } = madForecast;
  const { Headline: { Text: BudText }, DailyForecasts: budDailyForecasts } = budForecast;

  return (
    <div className="App">
      <div>
        <h2>Amserdam:<br /> {AmsText}</h2>
        {amsDailyForecasts.map((forecast: any) => (<p>{forecast.Date} | (max: {forecast.Temperature.Maximum.Value} / min: {forecast.Temperature.Minimum.Value}) | Day: {forecast.Day.IconPhrase} / Night: {forecast.Night.IconPhrase}</p>))}
      </div>
      <div>
        <h2>Madrid:<br /> {MadText}</h2>
        {madDailyForecasts.map((forecast: any) => (<p>{forecast.Date} | (max: {forecast.Temperature.Maximum.Value} / min: {forecast.Temperature.Minimum.Value}) | Day: {forecast.Day.IconPhrase} / Night: {forecast.Night.IconPhrase}</p>))}
      </div>
      <div>
        <h2>Budapest:<br /> {BudText}</h2>
        {budDailyForecasts.map((forecast: any) => (<p>{forecast.Date} | (max: {forecast.Temperature.Maximum.Value} / min: {forecast.Temperature.Minimum.Value}) | Day: {forecast.Day.IconPhrase} / Night: {forecast.Night.IconPhrase}</p>))}
      </div>
    </div>
  );
}

export default App;
