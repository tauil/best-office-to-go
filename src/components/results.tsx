import React from "react";

import { FinalResult, OfficeResults } from "../hooks/useBestOffice";
import { Flight } from "../hooks/useRequestOfficeFlights";

import "./results.scss";

interface ResultsProps {
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
          <div className="flight-info-detail"><em>Price:</em> ${flight.price}</div>
          <div className="flight-info-detail"><em>Duration:</em> {flight.duration}</div>
          <div className="flight-info-detail"><em>Available seats:</em> {flight.availability.seats}</div>
          <div className="flight-info-detail"><em>Stops:</em> {flight.stops}</div>
          <div className="flight-info-detail">{flight.deepLink && <a className="book-flight-link" href={flight.deepLink} target="_new">Book flight</a>}</div>
        </div>
      ))}
    </div>
  );
}

function WeatherIcon({ id, title, day }: { id: string, title: string, day: boolean }) {
  const finalTitle = `${title} during the ${day ? 'day' : 'night'}.`;

  return (
    <img className="weather-icon" title={finalTitle} alt={finalTitle} src={`https://www.accuweather.com/images/weathericons/${id}.svg`} />
  );
}

function Results({ result }: ResultsProps) {
  return (
    <section className="results">
      {result && result.map((office: any) => {
        const isCurrentLocationClassName = office.isCurrentLocation ? "current-location" : "";

        return (
          <div key={office.location} className={`office-result ${isCurrentLocationClassName}`}>
            <h2>{office.location}</h2>

            <section className="office-results">
              {office.results.map((result: OfficeResults) => (
                <div key={result.date} className="day">
                  <div className="date">{result.date}</div>
                  <div className="day-forecast"><WeatherIcon id={result.day.icon} title={result.day.text} day={true} /></div>
                  <div className="night-forecast"><WeatherIcon id={result.night.icon} title={result.night.text} day={false} /></div>
                  <div className="temp-forecast">
                    <div>{result.temperature.maximum}°</div>
                    <div>{result.temperature.minimum}°</div>
                  </div>
                  {!office.isCurrentLocation && <FlightsResults flights={result.flights} />}
                </div>
              ))}
            </section>

            {office.isCurrentLocation && <p className="disclaimer">Not showing flights for your current location</p>}
          </div>
        )
      })}
    </section>
  );
}

export default Results;
