import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000,
});

// Request interceptor: add auth token if present
http.interceptors.request.use(
  (config) => {
    // 兼容不同的 token 存储 key
    const token = localStorage.getItem("city_parking_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: unwrap data and handle common errors
http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 处理 401 未授权错误（token 过期或无效）
    if (error.response && error.response.status === 401) {
      // 清除所有 token
      localStorage.removeItem("city_parking_token");
      localStorage.removeItem("city_parking_user_session");
      localStorage.removeItem("city_parking_admin_session");
      sessionStorage.removeItem("city_parking_user_session");
      // 跳转到登录页（需要在组件中处理，这里只清除 token）
      // 可以通过 EventBus 或 Vue 实例通知需要重新登录
      if (
        window.location.pathname !== "/" &&
        window.location.pathname !== "/admin"
      ) {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default http;
