import React, { useState } from "react";
import { Button, Col, Form, Input, InputNumber, Row } from "antd";
import Dashboard from "@/components/Dashboard";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useRouter } from "next/router";

interface Product {
  id: number;
  user_id: number;
  name: string;
  description: string;
  quantity: number;
  price: number;
  category: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export default function Create() {
  const [product, setProduct] = React.useState({} as Product);
  const [isLoad, setIsLoad] = useState(false);

  const router = useRouter();

  const axios = useAxiosAuth();

  async function submit() {
    setIsLoad(true);
    await axios.post("/products", product);
    setIsLoad(false);
    router.push("/products");
  }

  return (
    <Dashboard>
      <div>
        <h1>Cadastrar produto</h1>

        <Row justify={"center"}>
          <Col>
            <Form
              labelCol={{ span: "auto" }}
              wrapperCol={{ span: "auto" }}
              layout="vertical"
              style={{ maxWidth: 600 }}
            >
              <Row>
                <Col>
                  <Form.Item label="Nome">
                    <Input
                      value={product.name}
                      onChange={(e) =>
                        setProduct({ ...product, name: e.target.value })
                      }
                    />
                  </Form.Item>

                  <Form.Item label="Descrição">
                    <Input
                      type=""
                      onChange={(e) =>
                        setProduct({ ...product, description: e.target.value })
                      }
                      value={product.description}
                    />
                  </Form.Item>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Quantidade">
                        <Input
                          onChange={(e) =>
                            setProduct({
                              ...product,
                              quantity: Number(e.target.value),
                            })
                          }
                          value={product.quantity}
                          suffix={"unidades"}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Preço">
                        <InputNumber
                          prefix="R$"
                          type="number"
                          precision={2}
                          value={product.price}
                          onChange={(e) =>
                            setProduct({
                              ...product,
                              price: Number(e),
                            })
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col>
                      <Form.Item label="Categoria">
                        <Input
                          onChange={(e) =>
                            setProduct({ ...product, category: e.target.value })
                          }
                          value={product.category}
                        />
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item label="Tipo">
                        <Input
                          onChange={(e) =>
                            setProduct({ ...product, type: e.target.value })
                          }
                          type=""
                          value={product.type}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row justify={"space-between"}>
                <Col span={8}>
                  <Button
                    onClick={() => router.push("/products")}
                    type="primary"
                    size={"middle"}
                  >
                    Voltar
                  </Button>
                </Col>
                <Col push={3} span={8}>
                  <Button type="primary" onClick={submit} size={"middle"}>
                    {isLoad ? "Carregando..." : "Criar"}
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
