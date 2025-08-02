import React, { useEffect, useState, Suspense, useRef } from "react";
import { ExternalApp } from "../../../app/AppRoutes";

const DynamicComponentLoader = (config: ExternalApp) => {
  const [Component, setComponent] = useState(null);

  useEffect(() => {
    if (config) {
      const savedComponent = (window as any)[config.name];
      if (savedComponent) {
        setComponent(() => savedComponent);
        return;
      }
      const script = document.createElement("script");
      script.src = config.url;
      script.async = true;

      script.onload = () => {
        if (config.name) {
          const LoadedComponent = (window as any)[config.name];
          setComponent(() => LoadedComponent);
        }
      };

      script.onerror = () => {
        console.error("Failed to load the external script");
      };

      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [config]);

  return <div>{Component ? <Component {...config} /> : <p>Loading...</p>}</div>;
};

export default DynamicComponentLoader;
