import axios from "axios";

export const get = async (url: string, path: string) => {
  const response = await axios.get(url + path);
  return response.data;
};

export const remove = async (url: string, path: string) => {
  return await axios.delete(`${url}${path}`);
};

export const update = async (url: string, path: string, data: any) => {
  return await axios.put(`${url}${path}`, data);
};

export const post = async (url: string, path: string, data: any) => {
  return await axios.post(`${url}${path}`, data);
};
