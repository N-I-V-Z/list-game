// src/utils/auth.js
import axios from "axios";
import config from "../config/config";
import { message } from "antd";
import { store } from "..";

export const isTokenExpired = (token) => {
  if (!token) return true;
  const payload = JSON.parse(atob(token.split(".")[1]));
  const expirationTime = payload.exp * 1000; // Chuyển đổi từ giây sang mili giây
  return Date.now() > expirationTime;
};

export const getAccessToken = async () => {
  let accessToken = store.getState().access_token;
  if (isTokenExpired(accessToken)) {
    // Làm mới access token
    const refreshToken = store.getState().refresh_token;

    try {
      const response = await axios.post(
        `${config.API_ROOT}/api/users/refresh-token`,
        { token: refreshToken }
      );
      console.log("24 ", response);
      if (response.data.err === 0) {
        accessToken = response.data.access_token;
        const state = store.getState();
        state.access_token = accessToken;
        store.dispatch({
          type: "LOGIN",
          payload: state,
        });
      } else {
        // Xử lý khi refresh token không hợp lệ
        message.error("Session expired, please log in again");
        window.location.href = "/login";
      }
    } catch (error) {
      message.error("Error refreshing token. Please log in again.");
      window.location.href = "/login";
    }
  }
  return accessToken;
};
