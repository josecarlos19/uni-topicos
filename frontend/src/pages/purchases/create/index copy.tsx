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
  const [products, setProducts] = useState<Product[]>([]);
  const [orderProducts, setOrderProducts] = useState<Products[]>([
    {
      id: 0,
      quantity: 0,
      price: 0,
    },
  ]);
  const [form] = Form.useForm();

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

  async function submit(values: any) {
    console.log(values);
    // setIsLoad(true);
    // await axios.post("/financial/buy", order);
    // setIsLoad(false);

    // openNotification();
    // setTimeout(() => {
    //   router.push("/purchases");
    // }, 2000);
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

    // console.log(orderProducts);
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
            onFinish={submit}
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
                <Form.Item label="Produtos" name="select_products">
                  <Select
                    style={{ width: "100%" }}
                    mode="multiple"
                    allowClear
                    placeholder="Selecione os produtos"
                    optionFilterProp="children"
                    onChange={handleSelectOrderProducts}
                    onDeselect={deleteOrderProduct}
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
                          </label>

                          <label
                            style={{
                              marginTop: "10px",
                              display: "block",
                              textAlign: "right",
                            }}
                          >
                            Disponível:{" "}
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
                <Button type="primary" size={"middle"}>
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
