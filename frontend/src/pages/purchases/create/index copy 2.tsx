import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Row, Select, Card, InputNumber } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import Dashboard from "@/components/Dashboard";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import moment from "moment";

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
  const [form] = Form.useForm();

  const router = useRouter();

  const { data: session } = useSession();
  const axios = useAxiosAuth();

  const handleOrderItem = (value: any) => {
    const formValues = form.getFieldsValue(["items"]);
    const itemsArray = formValues.items;
    console.log(itemsArray);
    const isDuplicate = itemsArray.some((item: any) => item.id === value);

    if (isDuplicate) {
      //remove the new value from the array
      const lastIndexOfNewValue = itemsArray.lastIndexOf(value);
      console.log(lastIndexOfNewValue);
      itemsArray.splice(lastIndexOfNewValue, 1);

      //update the array

      form.setFieldsValue({
        items: [
          ...itemsArray,
          {
            id: value,
          },
        ],
      });
    } else {
      form.setFieldsValue({
        items: [
          ...itemsArray,
          {
            id: value,
          },
        ],
      });
    }
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

  useEffect(() => {
    if (session?.user.accessToken) {
      getProducts();
    }
  }, [session?.user.accessToken]);

  return (
    <Dashboard>
      <div>
        <h1>Realizar compra</h1>

        <Row justify={"center"}>
          <Form
            form={form}
            labelCol={{ span: "auto" }}
            wrapperCol={{ span: "auto" }}
            layout="vertical"
            style={{ minWidth: 600, maxWidth: 600 }}
            onFinish={submit}
            name="order"
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Data da compra"
                  name="order_date"
                  initialValue={moment().format("YYYY-MM-DD")}
                >
                  <Input type="date" disabled={true} />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={24} style={{ overflow: "auto", height: "500px" }}>
                <Form.List name="items">
                  {(fields, { add, remove }) => (
                    <div
                      style={{
                        display: "flex",
                        rowGap: 16,
                        flexDirection: "column",
                      }}
                    >
                      {fields.map((field) => (
                        <Card
                          size="small"
                          title={`Produto ${field.name + 1}`}
                          key={field.key}
                          extra={
                            <CloseOutlined
                              onClick={() => {
                                remove(field.name);
                              }}
                            />
                          }
                        >
                          <Form.Item name={[field.name, "id"]}>
                            <Select
                              style={{ width: "100%" }}
                              allowClear
                              placeholder="Selecione o produto"
                              optionFilterProp="children"
                              options={products.map((product) => {
                                return {
                                  value: String(product.id),
                                  label: product.name,
                                };
                              })}
                              // onChange={(value) =>
                              //   setSelectedProducts([
                              //     ...selectedProducts,
                              //     value,
                              //   ])
                              // }
                              onChange={handleOrderItem}
                            />
                          </Form.Item>
                          <Row gutter={5}>
                            <Col span={7}>
                              <Form.Item
                                label="Quantidade"
                                name={[field.name, "quantity"]}
                              >
                                <InputNumber
                                  style={{ width: "100%" }}
                                  min={1}
                                  addonAfter="Un"
                                />
                              </Form.Item>
                            </Col>

                            <Col span={6}>
                              <Form.Item
                                label="Preço"
                                name={[field.name, "price"]}
                              >
                                <InputNumber
                                  style={{ width: "100%" }}
                                  min={1}
                                  addonBefore="R$"
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Card>
                      ))}

                      <Button type="dashed" onClick={() => add()} block>
                        + Adicionar produtos
                      </Button>
                    </div>
                  )}
                </Form.List>
              </Col>
            </Row>

            <br />
            <Row justify={"space-between"}>
              <Col>
                <Button
                  onClick={() => router.push("/purchases")}
                  type="primary"
                  size={"middle"}
                >
                  Voltar
                </Button>
              </Col>
              <Col>
                <Button
                  onClick={() => submit}
                  htmlType="submit"
                  type="primary"
                  size={"middle"}
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
