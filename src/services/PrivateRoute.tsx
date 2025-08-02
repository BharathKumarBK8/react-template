import { useKeycloak } from "@react-keycloak/web";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) {
    return <div>Initializing...</div>; // Or a loading indicator
  }

  return keycloak.authenticated ? children : <div>Please Login . . . </div>; // Redirect to root if not authenticated
};

export default PrivateRoute;
