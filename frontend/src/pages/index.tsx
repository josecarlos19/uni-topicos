import React from "react";
import { Button, Form, Col, Input, Row } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import styles from "../styles/Home.module.css";

const App = () => (
  <>
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
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              style={{ marginRight: "5px" }}
            >
              Login
            </Button>
            ou <a href="">Criar conta!</a>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  </>
);

export default App;
