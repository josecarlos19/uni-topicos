import React, { useState } from "react";
import { Button, Form, Col, Input, Row, notification } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import styles from "./styles.module.css";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { PiWarningOctagonFill } from "react-icons/pi";

const App = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();

  const openNotification = () => {
    api.open({
      message: "Erro ao fazer login!",
      duration: 4,
      description:
        "Verifique se o e-mail e a senha estão corretos e tente novamente.",
      icon: <PiWarningOctagonFill size={24} color={"#E87D85"} />,
    });
  };

  const submit = async () => {
    const login = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "/products",
    });

    if (login?.ok) {
      router.push(login.url as string);
    } else {
      openNotification();
    }
  };

  return (
    <>
      {contextHolder}
      <Row className={styles.container}>
        <Col className={styles.formCol} flex={3}>
          <div className={styles.logoName}>
            <h2>Estoque Mestre</h2>
          </div>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Digite o seu e-mail para prosseguir",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="E-mail"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Digite sua senha para prosseguir" },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Senha"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                style={{ marginRight: "5px" }}
                onClick={submit}
              >
                Login
              </Button>
              ou <a href="/signup">Criar conta!</a>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default App;
