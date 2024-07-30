import React from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import config from "../../config/config";
import Header from "../Layout/Header";
import { useNavigate } from "react-router-dom";
import { store } from "../../index";

const Login = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    if (!values.password || !values.username) {
      message.error("Missing input");
      return;
    }

    try {
      const response = await axios.post(`${config.API_ROOT}/api/users/login`, {
        userName: values.username,
        password: values.password,
      });
      if (response.data.err === 0) {

        message.success(response.data.mes);

        store.dispatch({
          type: "LOGIN",
          payload: {
            isLoggedIn: true,
            userName: response.data.data.data.username,
            access_token: response.data.data.access_token,
            refresh_token: response.data.data.refresh_token,
          },
        });

        navigate("/");

      } else {
        message.error(response.data.mes);
      }
    } catch (error) {
      console.log(error);
      message.error(error.response.data.mes);
    }
  };

  return (
    <div style={{ maxWidth: "300px", margin: "auto" }}>
      <Header />
      <h2>Login</h2>
      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          username: "",
          password: "",
        }}
      >
        <Form.Item
          name="username"
          label="User Name"
          rules={[{ required: true, message: "Please Enter User Name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please Enter Password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
