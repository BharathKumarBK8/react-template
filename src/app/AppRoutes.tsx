import React from "react";
import { Route, Routes } from "react-router-dom";
import PageCreator from "../common/pageCreator/PageCreator";
import PrivateRoute from "../services/PrivateRoute";
import DynamicComponentLoader from "../common/components/DynamicAppHandler/DynamicComponentLoader";
import Settings from "../pages/Settings";

export interface AppData {
  target: string;
  data: Record<string, any>;
}
export interface ExternalApp {
  url: string;
  name: string;
  onSave: (appData: AppData) => boolean;
  onClear: () => void;
}

export interface RouteConfigModel {
  path: string;
  configPath: string;
  isPrivate: boolean;
  externalApp?: ExternalApp;
}

const NotFound = () => <h2>404 Not Found</h2>;

const getComponent = (route: RouteConfigModel) => {
  if (route?.externalApp) {
    return route.isPrivate ? (
      <PrivateRoute>
        <DynamicComponentLoader {...route.externalApp} />
      </PrivateRoute>
    ) : (
      <DynamicComponentLoader {...route.externalApp} />
    );
  }

  return route.isPrivate ? (
    <PrivateRoute>
      <PageCreator key={route.path} {...route} />
    </PrivateRoute>
  ) : (
    <PageCreator key={route.path} {...route} />
  );
};

const AppRoutes: React.FC<{ routes: Array<RouteConfigModel> | null }> = ({
  routes,
}) => {
  return (
    <Routes>
      <Route path="/settings" element={<Settings />} />
      {routes?.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={getComponent(route)}
        />
      ))}
      <Route
        path="*"
        element={
          <PrivateRoute>
            <NotFound />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
