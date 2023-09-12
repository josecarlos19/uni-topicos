import React, { useState } from "react";
import styles from "./styles.module.css";
import {
  CustomerServiceOutlined,
  SmileOutlined,
  BarChartOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import TableList from "@/components/TableList";

const { Header, Content, Footer, Sider } = Layout;

const Dashboard: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [currentLabel, setCurrentLabel] = useState("Produtos");

  const sideBarItens = [
    {
      icon: CustomerServiceOutlined,
      label: "Produtos",
      key: 1,
    },
    {
      icon: SmileOutlined,
      label: "Clientes",
      key: 2,
    },
    {
      icon: BarChartOutlined,
      label: "Vendas",
      key: 3,
    },
    {
      icon: RiseOutlined,
      label: "Relatórios",
      key: 4,
    },
  ];

  function changeSideBarItem(event: any) {
    const label = sideBarItens.find((item) => +item.key === +event.key);
    setCurrentLabel(label!.label);
  }

  return (
    <Layout>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div>
          <div className={styles.logo}>
            <p>Estoque Mestre</p>
          </div>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          onClick={(e) => changeSideBarItem(e)}
          defaultSelectedKeys={["1"]}
          items={sideBarItens.map((item, index) => ({
            key: String(index + 1),
            icon: React.createElement(item.icon),
            label: item.label,
          }))}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        ></Header>
        <Content style={{ margin: "24px 16px 0", height: "100vh" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
            <h1>{currentLabel}</h1>
            <TableList data={[]} colums={[]} />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Estoque Mestre ©2023 Created by Uninassau Team
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
