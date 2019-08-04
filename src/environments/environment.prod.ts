import {KeycloakConfig} from "keycloak-angular";

// Add here your keycloak setup infos
const keycloakConfig: KeycloakConfig = {
  url: "https://login.marcoreitano.dev/auth",
  realm: "Mitneve",
  clientId: "mitneve"
};

export const environment = {
  production: true,
  keycloakConfig
};
