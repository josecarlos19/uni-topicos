import { GetServerSideProps } from "next";
import React, { useEffect } from "react";
import { Button, Col, Form, Input, Row, Table } from "antd";
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

  const router = useRouter();

  const { data: session } = useSession();
  const axios = useAxiosAuth();

  async function getOrder() {
    const response = (await axios.get(`/financial/fiscal/orders/${props.id}`))
      .data.order;

    setOrder(response);

    console.log(order);
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
                    disabled={true}
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
                    disabled={true}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Table
              style={{ minWidth: 600 }}
              dataSource={order.produtos_da_ordem}
              pagination={false}
              footer={() => (
                <Row justify={"space-between"}>
                  <Col span={8}>
                    <Form.Item label="Total da ordem">
                      <Input
                        type=""
                        addonBefore="R$"
                        value={Number(
                          order?.cabeçalho_da_ordem?.total_ordem,
                        ).toFixed(2)}
                        disabled={true}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              )}
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
