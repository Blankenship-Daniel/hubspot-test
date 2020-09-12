import { HubspotApiConfig } from "./hubspot.api";

export const environment = {
  production: true,
  apiKey: HubspotApiConfig.key,
  apiEndpoint: HubspotApiConfig.endpoint,
};
