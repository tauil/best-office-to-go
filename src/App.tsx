import React, { useEffect } from 'react';

import { useRequestWeatherApi } from "./hooks/useRequestApi";

import logo from './logo.svg';
import './App.css';

function App() {
  const [requestWeatherForecast, { data, loading, error }] = useRequestWeatherApi();

  useEffect(
    function loadAmsterdamForecast() {
      if (!data && !loading && !error) {
        requestWeatherForecast(249758);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, loading, error]
  );

  console.log(data);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
