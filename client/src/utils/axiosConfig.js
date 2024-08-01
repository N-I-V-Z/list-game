import axios from 'axios';
import config from '../config/config';
import { getAccessToken } from './auth';

// trang này để tạo hàm gọi api qua axios có kiểm tra token

// set api root 
const axiosInstance = axios.create({
  baseURL: config.API_ROOT,
});

// xử lý request
axiosInstance.interceptors.request.use(async (config) => {
  const token = await getAccessToken(); // lấy token của user
  if (token) {
    // set token vào headers
    config.headers['authorization'] = `Bearer ${token}`; // nếu có token thì gửi kèm token 
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// xử lý response
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const token = await getAccessToken();
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return axios(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; // muốn dùng thì chỉ cần import axiosInstance và dùng như axios thông thường (.axiosInstance.get(), .post(), .put(), .delete())
