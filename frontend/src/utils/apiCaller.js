import axios from "axios";

export const ApiCaller = (url, method, data = {}, host) => {
  return axios({
    url: `${host}${url}`,
    method,
    data,
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` || "" },
  });
};

export const NonAuthApiCaller = (url, method, data = {}, host) => {
  return axios({
    url: `${host}${url}`,
    method,
    data,
  });
};
