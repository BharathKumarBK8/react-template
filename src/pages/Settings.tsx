import React, { useState, useEffect, useRef } from "react";
import { getData, saveConfigData } from "../api/dataAPI";
import DialogBox from "../common/components/Dialogbox";
import DynamicComponentLoader from "../common/components/DynamicAppHandler/DynamicComponentLoader";
import "./Settings.css";
import { AppData, RouteConfigModel } from "../app/AppRoutes";
import { getRouteConfig } from "../api/config";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";

interface App {
  name: string;
  url: string;
  id: string;
  appData: AppData;
}

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [selectedApp, setSelectedApp] = useState<string>("");
  const [apps, setApps] = useState<App[]>([]);
  const [routes, setRoutes] = useState<RouteConfigModel[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedAppDetails, setSelectedAppDetails] = useState<App | null>(
    null
  );
  const [isInstalling, setInstalling] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsData, routesData] = await Promise.all([
          getData("app-data"),
          getRouteConfig(),
        ]);
        setApps(appsData);
        setRoutes(routesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const validateAppData = (
    appData: AppData,
    routes: RouteConfigModel[]
  ): { isValid: boolean; error?: string } => {
    if (!appData || typeof appData !== "object") {
      return {
        isValid: false,
        error: "Invalid appData: appData must be an object",
      };
    }

    if (!("target" in appData) || !("data" in appData)) {
      return {
        isValid: false,
        error: "Invalid appData: missing required properties (target or data)",
      };
    }

    const isValidTarget = routes.some(
      (route) => route.configPath === appData.target
    );
    if (!isValidTarget) {
      return {
        isValid: false,
        error: `Invalid target: ${appData.target} does not match any configPath in routes`,
      };
    }

    return { isValid: true };
  };

  const handleExternalAppSave = (appData: AppData): boolean => {
    const validationResult = validateAppData(appData, routes);

    if (!validationResult.isValid) {
      console.error("Settings - " + validationResult.error);
      toast.current?.show({
        severity: "error",
        summary: "Validation Error",
        detail: validationResult.error,
        life: 3000,
      });
      return false;
    }

    (async () => {
      if (selectedAppDetails) {
        try {
          setInstalling(true);
          const configData = {
            id: selectedAppDetails.id,
            name: selectedAppDetails.name,
            url: selectedAppDetails.url,
            appData,
          };

          await Promise.all([
            saveConfigData(configData),
            new Promise((resolve) => setTimeout(resolve, 2000)),
          ]);

          toast.current?.show({
            severity: "success",
            summary: "Success",
            detail: "Configuration installed successfully",
            life: 3000,
          });

          setSelectedApp("");
          setShowDialog(false);
        } catch (error) {
          console.error("Error adding app configuration:", error);
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to save configuration. Please try again.",
            life: 3000,
          });
        } finally {
          setInstalling(false);
        }
      }
    })();
    return true;
  };

  const handleAddButtonClick = async () => {
    const appDetails = apps.find((app) => app.id === selectedApp);
    if (appDetails) {
      setSelectedAppDetails(appDetails);
      setInstalling(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setInstalling(false);
      setShowDialog(true);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="settings-page">
      <Toast ref={toast} position="top-right" />

      <div className="settings-container">
        {/* Main Content */}
        <div className="settings-content back-button-container ">
          <i className="bi bi-arrow-left back-button" onClick={handleBack}></i>
          <div className="setting-title">Apps</div>
          <div className="app-selection-container">
            <select
              value={selectedApp}
              onChange={(e) => setSelectedApp(e.target.value)}
              className="app-dropdown"
            >
              <option value="">Select an app</option>
              {apps.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.name}
                </option>
              ))}
            </select>
            <button
              className="add-button"
              onClick={handleAddButtonClick}
              disabled={!selectedApp || isInstalling}
            >
              <i className="bi bi-plus"></i> Install
            </button>
          </div>
          {selectedApp && (
            <div className="selected-app-info">
              <p>
                Selected App: {apps.find((app) => app.id === selectedApp)?.name}
              </p>
              {isInstalling && (
                <div className="installing-indicator">
                  <div className="spinner"></div>
                  <span>Installing...</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog with Preview */}
      <DialogBox
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        title="Configuration"
        width="50vw"
      >
        <div className="preview-section">
          {selectedAppDetails && (
            <DynamicComponentLoader
              name={selectedAppDetails.name}
              url={selectedAppDetails.url}
              onSave={handleExternalAppSave}
              onClear={() => {}}
            />
          )}
        </div>
      </DialogBox>
    </div>
  );
};

export default Settings;
