import Keycloak from "keycloak-js";
import { ENVIRONMENT } from "../env";

const keycloak = new Keycloak({
  url: ENVIRONMENT.AUTH.URL,
  realm:  ENVIRONMENT.AUTH.REALM,
  clientId: ENVIRONMENT.AUTH.CLIENT_ID
});

export default keycloak;
