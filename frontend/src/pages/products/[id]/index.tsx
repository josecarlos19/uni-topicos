import { GetServerSideProps } from "next";
import React, { useEffect, useMemo, useState } from "react";
import { Button, Col, Form, Input, InputNumber, Row, Tooltip } from "antd";
import Dashboard from "@/components/Dashboard";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useSession } from "next-auth/react";
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

interface Props {
  id: string;
}

export default function Show(props: Props) {
  const [product, setProduct] = React.useState({} as Product);
  const [isShow, setIsShow] = useState(true);
  const [isLoad, setIsLoad] = useState(false);
  const [arrow, setArrow] = useState("Show");

  const router = useRouter();

  const { data: session } = useSession();
  const axios = useAxiosAuth();

  async function getProduct() {
    const response = (await axios.get(`/products/${props.id}`)).data.product;

    setProduct(response);
  }

  async function submit() {
    if (isShow) {
      setIsShow(false);
    } else {
      setIsLoad(true);
      await axios.patch(`/products/${props.id}`, product);
      setIsLoad(false);
      setIsShow(true);
    }
  }

  const mergedArrow = useMemo(() => {
    if (arrow === "Hide") {
      return false;
    }

    if (arrow === "Show") {
      return true;
    }

    return {
      pointAtCenter: true,
    };
  }, [arrow]);

  useEffect(() => {
    if (session?.user.accessToken) {
      getProduct();
    }
  }, [session?.user.accessToken]);

  return (
    <Dashboard>
      <div>
        <h1>{product.name}</h1>

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
                      disabled={isShow}
                    />
                  </Form.Item>

                  <Form.Item label="Descrição">
                    <Input
                      type=""
                      onChange={(e) =>
                        setProduct({ ...product, description: e.target.value })
                      }
                      value={product.description}
                      disabled={isShow}
                    />
                  </Form.Item>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Tooltip
                        placement="topLeft"
                        title={
                          "Quantidade de unidades do produto são modificadas através de uma compra ou venda."
                        }
                        arrow={mergedArrow}
                      >
                        <Form.Item label="Quantidade">
                          <Input
                            value={product.quantity}
                            disabled={true}
                            suffix={"unidades"}
                          />
                        </Form.Item>
                      </Tooltip>
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
                          disabled={isShow}
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
                          disabled={isShow}
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
                    onClick={() => router.push("/products")}
                    type="primary"
                    size={"middle"}
                    disabled={isLoad}
                  >
                    Voltar
                  </Button>
                </Col>
                <Col push={3} span={8}>
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
