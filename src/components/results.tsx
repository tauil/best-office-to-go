import React from "react";
import { parse, format } from 'date-fns'

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
          <p><em>Price:</em> ${flight.price}</p>
          <p><em>Duration:</em> {flight.duration}</p>
          <p><em>Available seats:</em> {flight.availability.seats}</p>
          <p>{flight.deepLink && <a href={flight.deepLink} target="_new">Book flight</a>}</p>
        </div>
      ))}
    </div>
  );
}

function Results({ result, loading }: ResultsProps) {
  if (!result || loading) {
    return (
      <section className="results loading">
        Loading...
      </section>
    );
  }

  return (
    <section className="results">
      {result.map((office: any) => {
        const isCurrentLocationClassName = office.isCurrentLocation ? "current-location" : "";

        return (
          <div key={office.location} className={`office-result ${isCurrentLocationClassName}`}>
            <h2>{office.location}</h2>
            <section className="results">
              {office.results.map((result: OfficeResults) => (
                <div key={result.date} className="day">
                  <p className="date">{result.date}</p>
                  <p className="day-forecast">Day: {result.day}</p>
                  <p className="night-forecast">Night: {result.night}</p>
                  <p className="temp-forecast">{result.temperature.maximum}° / {result.temperature.minimum}°</p>
                  {office.isCurrentLocation ? <p>Not showing flights for your current location</p> : <FlightsResults flights={result.flights} />}
                </div>
              ))}
            </section>
          </div>
        )
      })}
    </section>
  );
}

export default Results;
