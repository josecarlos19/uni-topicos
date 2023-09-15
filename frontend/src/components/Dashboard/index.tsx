import React from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { FaMoneyBillAlt, FaBoxes, FaAppleAlt } from "react-icons/fa";
import { BsFillPersonCheckFill } from "react-icons/bs";
import { Layout, Menu, theme } from "antd";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import DropDown from "@/components/DropDown";

const { Header, Content, Footer, Sider } = Layout;

const Dashboard = (props: { children: React.ReactNode }) => {
  const router = useRouter();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  function changePage(item: any) {
    router.push("/" + item.key);
  }

  const sideBarItens = [
    {
      icon: <FaAppleAlt size={22} />,
      label: "Produtos",
      key: "products",
    },
    {
      icon: <BsFillPersonCheckFill size={22} />,
      label: "Clientes",
      key: "customers",
    },
    {
      icon: <FaMoneyBillAlt size={22} />,
      label: "Vendas",
      key: "orders",
    },
    {
      icon: <FaBoxes size={22} />,
      label: "Compras",
      key: "purchases",
    },
  ];

  return (
    <Layout>
      <Sider style={{ height: "100vh" }} breakpoint="lg" collapsedWidth="0">
        <div>
          <div className={styles.logo}>
            <p className={styles.logoText}>Estoque Mestre</p>
          </div>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[router.pathname.split("/")[1]]}
          onClick={(e) => changePage(e)}
          items={sideBarItens}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <div className={styles.dropDown}>
            <DropDown />
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px 0",
            height: "calc(100vh - 155px)",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              height: "calc(100vh - 155px)",
            }}
          >
            {props.children}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Estoque Mestre ©2023 Created by Uninassau Team
        </Footer>
      </Layout>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession({ req: ctx.req });

  if (!session?.user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: {
        email: session.user.email,
      },
    },
  };
};

export default Dashboard;
