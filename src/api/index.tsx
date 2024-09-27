import { create } from "apisauce";
export const api = create({
  baseURL: "https://api.bsx.exchange/", // Example base URL
  headers: { Accept: "application/json" },
});
