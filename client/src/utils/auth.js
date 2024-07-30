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
  const state = store.getState();
  let accessToken = state.access_token;
  if (isTokenExpired(accessToken)) {
    // Làm mới access token
    const refreshToken = state.refresh_token;

    try {
      const response = await axios.post(
        `${config.API_ROOT}/api/users/refresh-token`,
        { token: refreshToken }
      );
      if (response.data !== null) {
        accessToken = response.data;
        store.dispatch({
          type: "LOGIN",
          payload: {
            isLoggedIn: true,
            username: state.username,
            access_token: accessToken,
            refresh_token: state.refresh_token,
          },
        });
      } else {
        // Xử lý khi refresh token không hợp lệ
        message.error("Session expired, please log in again");
        store.dispatch({
          type: "LOGOUT",
        });
        window.location.href = "/login";
      }
    } catch (error) {
      message.error("Error refreshing token. Please log in again.");
      store.dispatch({
        type: "LOGOUT",
      });
      window.location.href = "/login";
    }
  }
  return accessToken;
};
