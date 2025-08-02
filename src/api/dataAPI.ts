import { ENVIRONMENT } from "../env";
import { get, remove, update, post } from "../api/API";
import { AppData } from "../app/AppRoutes";

const API_URL = ENVIRONMENT.API_URL;

export const getData = async (url: string): Promise<any> => {
  return await get(API_URL, url);
};
export const postData = async (url: string, data: any): Promise<any> => {
  return await post(API_URL, url, data);
};
export const updateData = async (url: string, data: any): Promise<any> => {
  return await update(API_URL, url, data);
};
export const deleteData = async (url: string): Promise<any> => {
  return await remove(API_URL, url);
};
export const saveConfigData = async (configData: {
  id: string;
  name: string;
  url: string;
  appData: AppData;
}) => {
  try {
    const response = await postData("pushconfig-data", configData);
    if (!response) {
      throw new Error("Failed to save configuration");
    }
    return response;
  } catch (error) {
    throw error;
  }
};
