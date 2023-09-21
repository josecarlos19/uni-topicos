import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Space,
  Table,
  notification,
} from "antd";
import { FaCheck } from "react-icons/fa";
import Dashboard from "@/components/Dashboard";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import moment from "moment";

interface Products {
  produto: string;
  quantidade: number;
  preço: number;
}

interface OrderHeader {
  codigo_ordem: number;
  tipo_ordem: string;
  comprador: string;
  cliente: string;
  created_at: string;
  total_ordem: number;
}

interface Order {
  cabeçalho_da_ordem: OrderHeader;
  produtos_da_ordem: Products[];
}

interface Props {
  id: string;
}

export default function Show(props: Props) {
  const [order, setOrder] = React.useState({} as Order);
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

  async function getOrder() {
    const response = (await axios.get(`/financial/fiscal/orders/${props.id}`))
      .data.order;

    setOrder(response);

    console.log(order);
  }

  async function submit() {
    if (isShow) {
      setIsShow(false);
    } else {
      setIsLoad(true);
      await axios.patch(`/orders/${props.id}`, order);
      setIsLoad(false);
      setIsShow(true);

      openNotification();
      setTimeout(() => {
        router.push("/orders");
      }, 2000);
    }
  }

  useEffect(() => {
    if (session?.user.accessToken) {
      console.log("oi");
      getOrder();
    }
  }, [session?.user.accessToken]);

  return (
    <Dashboard>
      <div>
        {contextHolder}
        <h1>Visualizar ordem Nº {order?.cabeçalho_da_ordem?.codigo_ordem}</h1>

        <Row justify={"center"}>
          <Form
            labelCol={{ span: "auto" }}
            wrapperCol={{ span: "auto" }}
            layout="vertical"
            style={{ minWidth: 600 }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Comprador">
                  <Input
                    value={order?.cabeçalho_da_ordem?.comprador}
                    disabled={isShow}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Data da ordem">
                  <Input
                    type=""
                    value={moment(order?.cabeçalho_da_ordem?.created_at).format(
                      "DD/MM/YYYY",
                    )}
                    disabled={isShow}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Table
              style={{ minWidth: 600 }}
              dataSource={order.produtos_da_ordem}
              pagination={false}
            >
              <Table.Column title="Produto" dataIndex="produto" key="produto" />
              <Table.Column
                title="Quantidade(unidades)"
                dataIndex="quantidade"
                key="quantidade"
              />
              <Table.Column title="Preço(R$)" dataIndex="preço" key="preço" />
            </Table>
            <br />
            <Row justify={"space-between"}>
              <Col span={8}>
                <Button
                  onClick={() => router.push("/orders")}
                  type="primary"
                  size={"middle"}
                  disabled={isLoad}
                >
                  Voltar
                </Button>
              </Col>
            </Row>
          </Form>
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
