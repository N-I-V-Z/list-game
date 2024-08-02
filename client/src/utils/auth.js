// src/utils/auth.js
import axios from "axios";
import config from "../config/config";
import { message } from "antd";
import { store } from "..";

// hàm để kiểm tra token hết hạn
export const isTokenExpired = (token) => {
  if (!token) return true;
  const payload = JSON.parse(atob(token.split(".")[1]));
  const expirationTime = payload.exp * 1000; // Chuyển đổi từ giây sang mili giây
  return Date.now() > expirationTime;
};

// làm để lấy access token nếu token hết hạn
export const getAccessToken = async () => {
  const state = store.getState();
  // lấy token cũ được lưu
  let accessToken = state.access_token;
  // kiểm tra hết hạn
  if (isTokenExpired(accessToken)) {
    // lấy refresh token
    const refreshToken = state.refresh_token;

    try {
      // gọi api để lấy access token mới
      const response = await axios.post(
        `${config.API_ROOT}/api/users/refresh-token`,
        { token: refreshToken }
      );
      // lấy token mới và lưu lại
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
        // logout
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
