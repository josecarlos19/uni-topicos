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
  price: number;
}

interface Order {
  customer_id: number;
  products: Products[];
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
  const [totalOrder, setTotalOrder] = useState(0);

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
        "A compra foi realizada com sucesso. Você será redirecionado.",
      icon: <FaCheck size={24} color={"#3ddf14"} />,
    });
  };

  async function getProducts() {
    const response = (await axios.get("/products")).data.products;

    setProducts(response);
  }

  async function submit() {
    setIsLoad(true);
    await axios.post("/financial/buy", order);
    setIsLoad(false);

    openNotification();
    setTimeout(() => {
      router.push("/purchases");
    }, 2000);
  }

  const handleSelectOrderProducts = (selectedValues: string[]) => {
    setOrderProducts([]);
    const productsAux = [];
    for (let index = 0; index < selectedValues.length; index++) {
      const element = selectedValues[index];
      productsAux.push({
        id: Number(element),
        quantity: 1,
        name: products.find((product) => product.id === Number(element))?.name,
        price: Number(
          products.find((product) => product.id === Number(element))?.price,
        ),
      });
    }

    setOrderProducts(productsAux as any);

    console.log(orderProducts);
  };

  const handleOrderProductQuantity = (value: number, id: number) => {
    const productsAux = [...orderProducts];
    const productIndex = productsAux.findIndex((product) => product.id === id);
    productsAux[productIndex].quantity = value;
    setOrderProducts(productsAux);
  };

  const handleOrderProductPrice = (value: number, id: number) => {
    const productsAux = [...orderProducts];
    const productIndex = productsAux.findIndex((product) => product.id === id);
    productsAux[productIndex].price = Number(value);
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
          price: product.price,
        };
      }),
    });

    if (order.products && order.products.length > 0) {
      setTotalOrder(
        order.products.reduce((total, product) => {
          return (
            total +
            Number(
              products.find((productAux) => productAux.id === product.id)
                ?.price,
            ) *
              product.quantity
          );
        }, 0),
      );
    }

    console.log(order.products);
  }, [orderProducts, products]);

  return (
    <Dashboard>
      <div>
        {contextHolder}
        <h1>Realizar compra</h1>

        <Row justify={"center"}>
          <Form
            labelCol={{ span: "auto" }}
            wrapperCol={{ span: "auto" }}
            layout="vertical"
            style={{ minWidth: 600, maxWidth: 600 }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Data da compra">
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
                        label: product.name,
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
                          <label>R$ {totalOrder.toFixed(2)}</label>
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
                            defaultValue={item.quantity}
                            onChange={(value) => {
                              handleOrderProductQuantity(value, item.id);
                            }}
                            addonAfter="Un"
                          />

                          <InputNumber
                            min={"0"}
                            defaultValue={
                              products.find((product) => product.id === item.id)
                                ?.price
                            }
                            placeholder="Preço"
                            addonBefore={"R$"}
                            onChange={(value) => {
                              handleOrderProductPrice(Number(value), item.id);
                            }}
                          />

                          <label
                            style={{
                              marginTop: "10px",
                              display: "block",
                              textAlign: "right",
                            }}
                          >
                            Subtotal: R${" "}
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
                              .quantity + item.quantity}
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
                    isLoad || (order.products && order.products.length === 0)
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
