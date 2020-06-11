import React, { useEffect } from 'react';

import useBestOffice from "./hooks/useBestOffice";

import './App.css';

function App() {
  const [ request, { result, loading, error } ] = useBestOffice();

  useEffect(
    function loadBestOffice() {
      if (!result && !loading && !error) {
        request();
      }
    },
    [ result, loading, error]
  );

  if (!result || loading) {
    return (
      <p>Loading...</p>
    );
  }

  return (
    <div className="App">
      {result.map((office: any) => (
        <div key={office.location} className={office.bestOffice ? 'best-office' : undefined}>
          <h2>{office.location}</h2>
          <p>{office.weather.temperature.min} / {office.weather.temperature.max}</p>
          <p>{office.weather.conditions}</p>
          {office.bestOffice && <button onClick={() => alert("Book!")}>Book flight</button>}
        </div>
      ))}
    </div>
  );
}

export default App;
