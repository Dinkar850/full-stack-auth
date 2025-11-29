import axios from "axios";
import { BACKEND_URL } from "../constants/url";

const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

let isRefreshing = false;

// the array that stores requests that failed when refreshing of original request(that called refresh token for the first time) was happening
let refreshSubscribers = [];

//adds a failed request using older token in the waiting list of subscribers so that each request doesn't trigger a refresh separately when refreshing of first one that triggered it is going on, when one of the request refreshses token each request or subscriber uses the new token, then it retries everytime a new token is fetched
function addSubscriberToToken(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(newToken) {
  refreshSubscribers.forEach((cb) => cb(newToken)); //retry all requests with new token
  refreshSubscribers = []; //empty the refreshSubscribers
}

//request interceptor (attaching headers to each request)
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config; //ask what is in config

    //in case of network error
    if (!error.response) {
      console.error("Network error");
      return Promise.reject(error);
    }

    const status = error.response.status;

    //if status is not 403, never refresh
    if (status !== 401) {
      return Promise.reject(error);
    }
    console.error("Access token expired, trying to refresh...");

    //preventing inf loops by not constantly retrying retriede request that also returned constant 401s
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    //refresh already happening so add to waiting queue of subscribers
    if (isRefreshing) {
      return new Promise((resolve) => {
        addSubscriberToToken((newToken) => {
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          resolve(api(originalRequest));
        });
      });
    }
    //above is before isRefreshing is set to true as to check if its already true or not from previous requests, if we move below statement before, then each request, even the original one that caused the first refresh as well

    //starting to refresh
    isRefreshing = true;
    console.log("trying to refresh token");
    try {
      console.log("starting to refrsh now...");
      const refreshResponse = await api.post("/auth/refreshToken");
      console.log("refreshed token");
      const newAccessToken = refreshResponse.data.accessToken;
      console.log("new token", newAccessToken);
      localStorage.setItem("accessToken", newAccessToken);

      //update axios default header globally (for all requests, this is necessary as api.interceptors.request.use doesnt get hit in retries)
      api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

      //refreshing complete
      isRefreshing = false;

      //retry queued requests now
      onRefreshed(newAccessToken);

      //retry the original request
      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
      return api(originalRequest); //retrying here after again setting header
    } catch (refreshError) {
      isRefreshing = false;
      localStorage.removeItem("accessToken");
      return Promise.reject(refreshError);
    }
  }
);

export default api;
