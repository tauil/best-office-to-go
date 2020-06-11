import axios from "axios";

const API_URL = "https://api.skypicker.com/";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "Content-type": "application/json; charset=UTF-8",
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Accept: "application/json",
  },
});

// Default to Amsterdam lat / long
export const getLocalAirport = (lat: number = 52.3730944, long: number = 4.9053696) =>
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

export const getFlightsFrom = (fromAirportCode: string, toAirportCode: string, dateFrom: string, dateTo: string) =>
  apiClient.get<any>(`/flights`, {
    params: {
      flyFrom: fromAirportCode,
      to: toAirportCode,
      dateFrom: dateFrom,
      dateTo: dateTo,
      partner: "picky",
      v: 3,
      max_stopovers: 0,
      sort: "price"
    }
  });
