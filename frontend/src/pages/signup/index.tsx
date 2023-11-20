import React, { useState } from "react";
import { Button, Form, Col, Input, Row, notification } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import styles from "./styles.module.css";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { PiWarningOctagonFill } from "react-icons/pi";
import { AiOutlineMail } from "react-icons/ai";
import axios from "axios";
import { convertToObject } from "typescript";

const App = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassowrd, setConfirmPassword] = useState("");

  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();

  const checkPassword = () => {
    return password === confirmPassowrd;
  };

  const openNotification = (error: string) => {
    api.open({
      message: "Erro ao criar conta!",
      duration: 4,
      description: error.toLowerCase().includes("Email")
        ? "Este e-mail já está em uso."
        : "Verifique se os dados estão corretos e tente novamente.",
      icon: <PiWarningOctagonFill size={24} color={"#E87D85"} />,
    });
  };

  const submit = async () => {
    if (checkPassword()) {
      await axios
        .post(`http://localhost:3001/signup`, {
          email,
          name,
          password,
        })
        .then(() => {
          router.push("/login");
        })
        .catch((error) => openNotification(error.response.data.error));
    } else {
      openNotification("As senhas não coincidem");
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
                prefix={<AiOutlineMail className="site-form-item-icon" />}
                placeholder="E-mail"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: "Digite o seu nome",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Nome"
                onChange={(e) => setName(e.target.value)}
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

            <Form.Item
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: "Digite sua senha novamente para prosseguir",
                },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Confirme sua senha"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Item>

            <Form.Item>
              <Row gutter={10}>
                <Col flex={1}>
                  <Button
                    type="link"
                    htmlType="submit"
                    className="login-form-button"
                    onClick={() => router.push("/login")}
                  >
                    Voltar
                  </Button>
                </Col>
                <Col flex={1}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                    onClick={submit}
                  >
                    Criar conta
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default App;
