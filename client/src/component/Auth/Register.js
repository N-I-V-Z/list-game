import React from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import config from "../../config/config";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    if (!values.confirm_password || !values.password || !values.username){
      message.error('Missing input');
      return;
    }
    if(values.confirm_password !== values.password) {
        message.error('Invalid Confirm Password!');
        return;
    }
    try {
        const response = await axios.post(`${config.API_ROOT}/api/users/register`, {
          userName: values.username,
          password: values.password,
          role: 2
        });
        if (response.data.err === 0){
          message.success('Register successfully');
          navigate('/login');
        }else {
          message.error(response.data.mes);
        }
    } catch (error) {
        message.error(error.response.data.mes);
    }
  };

  return (
    <div style={{ maxWidth: "300px", margin: "auto" }}>
      <h2>Register</h2>
      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          username: "",
          password: "",
          confirm_password: "",
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

        <Form.Item
          name="confirm_password"
          label="Confirm Password"
          rules={[
            { required: true, message: "Please Enter Confirm Password!" },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
