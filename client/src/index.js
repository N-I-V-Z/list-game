import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import createStore from "./store";

// set giá trị ban đầu cho state
let initialValues = JSON.parse(localStorage.getItem("state")) || {
  isLoggedIn: false,
  username: null,
  access_token: null,
  refresh_token: null,
};

// tạo hàm xử lý state
const reducer = (state, action) => {
  if (action.type === "LOGIN") {
    initialValues = {
      isLoggedIn: action.payload.isLoggedIn,
      username: action.payload.username,
      access_token: action.payload.access_token,
      refresh_token: action.payload.refresh_token,
    };
    return initialValues;
  } else if (action.type === "LOGOUT") {
    initialValues = {
      isLoggedIn: false,
      username: null,
      access_token: null,
      refresh_token: null,
    };
    return initialValues;
  }
};

// trả ra store để các hàm khác gọi vào
export const store = createStore(reducer, initialValues);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
