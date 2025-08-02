import React from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import "../../app/App.css";

interface LoaderProps {
  fullScreen?: boolean;
  size?: number;
  strokeWidth?: string;
  fill?: string;
  animationDuration?: string;
}

const Loader: React.FC<LoaderProps> = ({
  fullScreen = false,
  size = 50,
  strokeWidth = "4",
  fill = "#f3f3f3",
  animationDuration = ".5s",
}) => {
  const containerClass = fullScreen
    ? "loader-container fullscreen"
    : "loader-container";

  return (
    <div className={containerClass}>
      <ProgressSpinner
        style={{ width: `${size}px`, height: `${size}px` }}
        strokeWidth={strokeWidth}
        fill={fill}
        animationDuration={animationDuration}
      />
    </div>
  );
};

export default Loader;
