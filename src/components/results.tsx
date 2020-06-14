import React from "react";

import { FinalResult, OfficeResults } from "../hooks/useBestOffice";
import { Flight } from "../hooks/useRequestOfficeFlights";

import "./results.scss";

interface ResultsProps {
  loading: boolean;
  result: FinalResult[] | null;
};

function FlightsResults({ flights }: {flights: Flight[]}) {
  if (!flights) {
    return (<div>No flights found.</div>);
  }

  return (
    <div className="flights">
      {flights.map((flight: Flight) => (
        <div key={flight.id} className="flight-info">
          <p>Price: ${flight.price}</p>
          <p>Duration: {flight.duration.total}</p>
          <p>Available seats: {flight.availability.seats}</p>
          <p>{flight.deepLink && <button onClick={() => console.log(flight.deepLink)}>Book flight</button>}</p>
        </div>
      ))}
    </div>
  );
}

function Results({ result, loading }: ResultsProps) {
  if (!result || loading) {
    return (
      <section className="results">
        Loading...
      </section>
    );
  }

  return (
    <section className="results">
      {result.map((office: any) => (
        <div key={office.location} className={office.bestOffice ? 'best-office' : undefined}>
          <h2>{office.location}</h2>
          <section className="results">
            {office.results.map((result: OfficeResults) => (
              <div key={result.date} className="day">
                <p>{result.date}</p>
                <p>Day: {result.day}</p>
                <p>Night: {result.night}</p>
                <p>Temperature: {result.temperature.maximum}{result.temperature.unit} / {result.temperature.minimum}{result.temperature.unit}</p>
                <FlightsResults flights={result.flights} />
              </div>
            ))}
          </section>
        </div>
      ))}
    </section>
  );
}

export default Results;
