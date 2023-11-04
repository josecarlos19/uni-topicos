import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Row, notification } from "antd";
import { FaCheck } from "react-icons/fa";
import Dashboard from "@/components/Dashboard";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

interface Customer {
  id: number;
  user_id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

interface Props {
  id: string;
}

export default function Show(props: Props) {
  const [customer, setCustomer] = React.useState({} as Customer);
  const [isShow, setIsShow] = useState(true);
  const [isLoad, setIsLoad] = useState(false);

  const router = useRouter();

  const { data: session } = useSession();
  const axios = useAxiosAuth();
  const [api, contextHolder] = notification.useNotification();

  const openNotification = () => {
    api.open({
      message: "Sucesso!",
      duration: 2,
      description:
        "O produto foi editado com sucesso. Você será redirecionado.",
      icon: <FaCheck size={24} color={"#3ddf14"} />,
    });
  };

  async function getCustomer() {
    const response = (await axios.get(`/customers/${props.id}`)).data
      .customer[0];

    setCustomer(response);
  }

  async function submit() {
    if (isShow) {
      setIsShow(false);
    } else {
      setIsLoad(true);
      await axios.patch(`/customers/${props.id}`, customer);
      setIsLoad(false);
      setIsShow(true);

      openNotification();
      setTimeout(() => {
        router.push("/customers");
      }, 1000);
    }
  }

  useEffect(() => {
    if (session?.user.accessToken) {
      getCustomer();
    }
  }, [session?.user.accessToken]);

  return (
    <Dashboard>
      <div>
        {contextHolder}
        <h1>{customer.name}</h1>

        <Row justify={"center"}>
          <Col>
            <Form
              labelCol={{ span: "auto" }}
              wrapperCol={{ span: "auto" }}
              layout="vertical"
              style={{ minWidth: 600 }}
            >
              <Row>
                <Col style={{ minWidth: 600 }}>
                  <Form.Item label="Nome">
                    <Input
                      value={customer.name}
                      onChange={(e) =>
                        setCustomer({ ...customer, name: e.target.value })
                      }
                      disabled={isShow}
                    />
                  </Form.Item>

                  <Row>
                    <Col style={{ minWidth: 600 }}>
                      <Form.Item label="E-mail">
                        <Input
                          type=""
                          onChange={(e) =>
                            setCustomer({ ...customer, email: e.target.value })
                          }
                          value={customer.email}
                          disabled={isShow}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row justify={"space-between"}>
                <Col span={8}>
                  <Button
                    onClick={() => router.push("/customers")}
                    type="primary"
                    size={"middle"}
                    disabled={isLoad}
                  >
                    Voltar
                  </Button>
                </Col>
                <Col>
                  <Button
                    onClick={submit}
                    style={{ backgroundColor: "#FE4D1C", color: "#fff" }}
                    size={"middle"}
                    disabled={isLoad}
                  >
                    {isLoad ? "Carregando..." : isShow ? "Editar" : "Salvar"}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </div>
    </Dashboard>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string;

  return {
    props: {
      id,
    },
  };
};
