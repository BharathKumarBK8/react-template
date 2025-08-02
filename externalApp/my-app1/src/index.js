import React from "react";
import { App } from "./App";

const MyComponent = () => {
  return <div>Test App!!!</div>; //remove
};

// Attach the component to the global `window` object
window["TestApp"] = App;
