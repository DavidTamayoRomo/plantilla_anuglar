import { KeycloakConfig } from "keycloak-js";

const keycloakConfig: KeycloakConfig = {
    url: 'https://sso-poc.quito.gob.ec:8443/auth/',
    realm: 'Municipales',
    clientId: 'app-gbi',
};

export const environment = {
    production: false,
    offline: false,
    multiTenant: true,
    home_page: 'http://localhost:4200/admin',
    keycloakConfig,



};
