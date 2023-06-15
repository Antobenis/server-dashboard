import React from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Col, Row, message, Spin } from "antd";
import { useServerLogin } from "hooks/AuthHooks";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import logo from "assets/logo.png";
import { useNotificationPush } from "hooks/WebHooks";

const Login = () => {
    const navigate = useNavigate();
    const { mutate: serverLogin, isLoading: loading } = useServerLogin();
    const { data: notify } = useNotificationPush();

    const onLogin =  (formData) => {
       
        serverLogin(formData, {
            onSuccess: async (data) => {
                message.success("You have successfully Logged In");
                Cookies.set("server_token", data?.data?.token);
                await notify
                navigate("/dashboard");
            },
            onError: (error) => {
                if (error.response.data === undefined) {
                    message.error(error.message);
                } else {
                    message.error(error.response.data.error);
                }
            },
        });
    };
    const onFinishFailed = (errorInfo) => {
        console.log(errorInfo);
    };
    return (
        <Row justify="center" align="middle" className="login-height">
            <Col span={24}>
                <Spin spinning={loading}>
                    <Form
                        className="center-form"
                        name="basic"
                        initialValues={{
                            email: "admin1@gmail.com",
                            password: "admin@123",
                        }}
                        onFinish={onLogin}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Row>
                            <Col>
                                <img
                                    style={{ height: "85px", width: "100%" }}
                                    src={logo}
                                    alt="img"
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} style={{ marginTop: "25px" }}>
                                <Form.Item
                                    style={{ boder: "none" }}
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input your username!",
                                        },
                                    ]}
                                >
                                    <Input placeholder="Email Address" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your password!",
                                },
                            ]}
                        >
                            <Input.Password placeholder="Password" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-button">
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                </Spin>
            </Col>
        </Row>
    );
};

export default Login;
