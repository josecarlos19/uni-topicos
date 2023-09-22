import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
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
  id: number;
  quantity: number;
}

interface Order {
  customer_id: number;
  products: Products[];
}

interface Props {
  id: string;
}

interface CustomerLabel {
  value: string;
  label: string;
}

interface Product {
  id: number;
  user_id: number;
  name: string;
  description: string;
  quantity: number;
  price: string;
  category: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export default function Show(props: Props) {
  const [order, setOrder] = React.useState({} as Order);
  const [products, setProducts] = React.useState<Product[]>([]);

  const [customers, setCustomers] = React.useState<CustomerLabel[]>([]);

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

  async function getCustomers() {
    const response = (await axios.get("/customers")).data.customers.map(
      (customer: any) => {
        return {
          value: String(customer.id),
          label: customer.name,
        };
      },
    );

    setCustomers(response);
  }

  async function getProducts() {
    const response = (await axios.get("/products")).data.products;

    setProducts(response);
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

  const handleChangeCustomer = (value: string) => {
    setOrder({ ...order, customer_id: Number(value) });
  };

  useEffect(() => {
    if (session?.user.accessToken) {
      getCustomers();
      getProducts();
    }
  }, [session?.user.accessToken]);

  return (
    <Dashboard>
      <div>
        {contextHolder}
        <h1>Realizar venda</h1>

        <Row justify={"center"}>
          <Form
            labelCol={{ span: "auto" }}
            wrapperCol={{ span: "auto" }}
            layout="vertical"
            style={{ minWidth: 600 }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Cliente">
                  <Select
                    placeholder="Selecione um(a) cliente"
                    optionFilterProp="children"
                    onChange={handleChangeCustomer}
                    options={customers}
                    key={customers[0]?.value}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Data da ordem">
                  <Input
                    type=""
                    value={moment().format("DD/MM/YYYY")}
                    disabled={isShow}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Table
              style={{ minWidth: 600 }}
              dataSource={products}
              pagination={false}
            >
              <Table.Column title="Produto" dataIndex="name" key="name" />
              <Table.Column
                title="Quantidade(unidades)"
                dataIndex="quantity"
                key="quantity"
              />
              <Table.Column title="Preço(R$)" dataIndex="price" key="price" />
            </Table>
            <br />
            <Row justify={"space-between"}>
              <Col>
                <Button
                  onClick={() => router.push("/orders")}
                  type="primary"
                  size={"middle"}
                  disabled={isLoad}
                >
                  Voltar
                </Button>
              </Col>
              <Col>
                <Button
                  onClick={() => router.push("/orders")}
                  type="primary"
                  size={"middle"}
                  disabled={isLoad}
                >
                  Confirmar
                </Button>
              </Col>
            </Row>
          </Form>
        </Row>
      </div>
    </Dashboard>
  );
}
