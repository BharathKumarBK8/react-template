import { ENVIRONMENT } from "../env";
import { get } from "../api/API";
const SERVER_URL = ENVIRONMENT.CONFIG_URL;

const HEADER = "header";
export const getHeaderConfig = () => {
  return get(SERVER_URL, HEADER).then((data) => data.header || data);
};

const LEFT_MENU = "leftmenu";
export const getLeftMenuConfig = () => {
  return get(SERVER_URL, LEFT_MENU).then((data) => data.leftmenu || data);
};

const ROUTE = "routes";
export const getRouteConfig = () => {
  return get(SERVER_URL, ROUTE).then((data) => data.routes || data);
};

export const getConfig = (path: string) => {
  return get(SERVER_URL, path).then((data) => {
    const key = path.split("/").pop();
    // Add type checking for key
    if (key) {
      return data[key as keyof typeof data] || data;
    }
    return data;
  });
};
