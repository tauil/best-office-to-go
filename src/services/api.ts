import { setupCache } from "axios-cache-adapter"

const cache = setupCache({
  maxAge: 15 * 60 * 1000
});

export function axiosSetup(apiURL: string) {
  return {
    baseURL: apiURL,
    headers: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      "Content-type": "application/json; charset=UTF-8",
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Accept: "application/json",
    },
    adapter: cache.adapter,
  }
}
