import React, { useEffect, useState } from 'react';

import useBestOffice from "./hooks/useBestOffice";
import Results from "./components/results";

import './App.scss';

interface MainState {
  max_stops: number;
}

const initialState: MainState = {
  max_stops: 0,
};

function App() {
  const [ request, { result, loading, error } ] = useBestOffice();
  const [ preferences, setPreferences ] = useState(initialState);

  useEffect(
    function loadBestOffice() {
      if (!result && !loading && !error) {
        request(preferences.max_stops);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ preferences, result, loading, error ]
  );

  function updatePreferences(stopsCount: number) {
    setPreferences(prevState => ({
      ...prevState,
      max_stops: stopsCount,
    }));
  }

  return (
    <div className="App">
      <div className="preferences">
        <label>Number of stops:</label>
        <input type="number" onChange={event => updatePreferences(parseInt(event.target.value))} value={preferences.max_stops} />
        <button onClick={() => request(preferences.max_stops)}>Update search</button>
      </div>
      <Results result={result} loading={loading} />
      <p>0.0.1</p>
    </div>
  );
}

export default App;
