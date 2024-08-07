import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "antd";
import { store } from "../../index";
import "./Header.css";

function Header() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isLoggedIn = store.getState().isLoggedIn;

  const handleLogout = () => {
    store.dispatch({
      type: "LOGOUT",
    });
  };

  return (
    <div className="header-container">
      <Menu
        mode="horizontal"
        className="header-menu"
        selectedKeys={[currentPath]}
      >
        <Menu.Item key="/">
          <Link to="/">Home</Link>
        </Menu.Item>
        {!isLoggedIn ? (
          <>
            <Menu.Item key="/login">
              <Link to="/login">Login</Link>
            </Menu.Item>
            <Menu.Item key="/register">
              <Link to="/register">Register</Link>
            </Menu.Item>
          </>
        ) : (
          <Menu.Item>
            <div onClick={handleLogout}>Logout</div>
          </Menu.Item>
        )}
      </Menu>
    </div>
  );
}

export default Header;
