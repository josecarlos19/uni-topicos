import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  notification,
  List,
  Card,
  Space,
  InputNumber,
  Divider,
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

export default function Show() {
  const [order, setOrder] = React.useState({} as Order);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [orderProducts, setOrderProducts] = React.useState<Products[]>([]);

  const [customers, setCustomers] = React.useState<CustomerLabel[]>([]);

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
    setIsLoad(true);
    await axios.post("/financial/sell", order);
    setIsLoad(false);

    openNotification();
    setTimeout(() => {
      router.push("/orders");
    }, 2000);
  }

  const handleChangeCustomer = (value: string) => {
    setOrder({ ...order, customer_id: Number(value) });
  };

  const handleSelectOrderProducts = (selectedValues: string[]) => {
    setOrderProducts([]);
    const productsAux = [];
    for (let index = 0; index < selectedValues.length; index++) {
      const element = selectedValues[index];
      productsAux.push({
        id: Number(element),
        quantity: 1,
        name: products.find((product) => product.id === Number(element))?.name,
      });
    }

    setOrderProducts(productsAux);

    console.log(orderProducts);
  };

  const handleOrderProductQuantity = (value: number, id: number) => {
    const productsAux = [...orderProducts];
    const productIndex = productsAux.findIndex((product) => product.id === id);
    productsAux[productIndex].quantity = value;
    setOrderProducts(productsAux);
  };

  const deleteOrderProduct = (value: string) => {
    const productsAux = [...orderProducts];
    const productIndex = productsAux.findIndex(
      (product) => product.id === Number(value),
    );
    productsAux.splice(productIndex, 1);
    setOrderProducts(productsAux);
  };

  useEffect(() => {
    if (session?.user.accessToken) {
      getCustomers();
      getProducts();
    }
  }, [session?.user.accessToken]);

  useEffect(() => {
    setOrder({
      ...order,
      products: orderProducts.map((product) => {
        return {
          id: product.id,
          quantity: product.quantity,
        };
      }),
    });
    console.log(order);
  }, [orderProducts]);

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
            style={{ minWidth: 600, maxWidth: 600 }}
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
                    disabled={true}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="Produtos">
                  <Select
                    style={{ width: "100%" }}
                    mode="multiple"
                    allowClear
                    placeholder="Selecione os produtos"
                    optionFilterProp="children"
                    onChange={(value) => handleSelectOrderProducts(value)}
                    onDeselect={(value) => {
                      deleteOrderProduct(value);
                    }}
                    options={products.map((product) => {
                      return {
                        value: String(product.id),
                        label: product.name + " - " + "R$ " + product.price,
                      };
                    })}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <label>Produtos selecionados: {orderProducts.length}</label>

              <Col span={24} style={{ overflow: "auto", height: "310px" }}>
                <Form.Item style={{ paddingTop: "8px" }}>
                  <List
                    grid={{ column: 2 }}
                    bordered
                    footer={
                      <div>
                        <Divider />
                        <Space>
                          <label>Total:</label>
                          <label>
                            R${" "}
                            {orderProducts
                              .reduce(
                                (acc, cur) =>
                                  acc +
                                  Number(
                                    products.find(
                                      (product) => product.id === cur.id,
                                    )?.price,
                                  ) *
                                    cur.quantity,
                                0,
                              )
                              .toFixed(2)}
                          </label>
                        </Space>
                      </div>
                    }
                    dataSource={orderProducts}
                    renderItem={(item: any) => (
                      <List.Item>
                        <Card
                          style={{ marginTop: "10px" }}
                          size="small"
                          title={item.name}
                          key={item.id}
                        >
                          <InputNumber
                            style={{ width: "100%" }}
                            min={1}
                            max={
                              products.find((product) => product.id === item.id)
                                ?.quantity
                            }
                            defaultValue={item.quantity}
                            onChange={(value) => {
                              handleOrderProductQuantity(value, item.id);
                            }}
                            addonAfter="Un"
                          />

                          <label
                            style={{
                              marginTop: "10px",
                              display: "block",
                              textAlign: "right",
                            }}
                          >
                            R${" "}
                            {(
                              Number(
                                products.find(
                                  (product) => product.id === item.id,
                                )?.price,
                              ) * item.quantity
                            ).toFixed(2)}
                          </label>

                          <label
                            style={{
                              marginTop: "10px",
                              display: "block",
                              textAlign: "right",
                            }}
                          >
                            Disponível:{" "}
                            {products.find((product) => product.id === item.id)!
                              .quantity - item.quantity}
                          </label>
                        </Card>
                      </List.Item>
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>

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
                  onClick={() => submit()}
                  type="primary"
                  size={"middle"}
                  disabled={
                    isLoad ||
                    order.customer_id === undefined ||
                    order.products.length === 0
                  }
                >
                  Confirmar venda
                </Button>
              </Col>
            </Row>
          </Form>
        </Row>
      </div>
    </Dashboard>
  );
}
