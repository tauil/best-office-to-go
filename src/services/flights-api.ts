import axios from "axios";

import { axiosSetup } from "./api";

const API_URL = "https://api.skypicker.com/";

const apiClient = axios.create(axiosSetup(API_URL));

// Default to Amsterdam lat / long
export const getLocalAirport = (lat: number, long: number) =>
  apiClient.get<any>(`/locations`, {
    params: {
      radius: 50,
      type: "radius",
      locale: "en-US",
      location_types: "airport",
      limit: 10,
      active_only: true,
      sort: "name",
      lat: lat,
      lon: long,
    }
  });

export const getFlightsFrom = (fromAirportCode: string, toAirportCode: string, dateFrom: string, dateTo: string, stops: number) =>
  apiClient.get<any>(`/flights`, {
    params: {
      flyFrom: fromAirportCode,
      to: toAirportCode,
      dateFrom: dateFrom,
      dateTo: dateTo,
      partner: "picky",
      v: 3,
      max_stopovers: stops,
      sort: "price",
      flight_type: "oneway",
      limit: 10,
    }
  });
