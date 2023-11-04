import { GetServerSideProps } from "next";
import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Tooltip,
  notification,
} from "antd";
import { FaCheck } from "react-icons/fa";
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
  min_quantity: number;
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
  const [arrow] = useState("Show");

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

      openNotification();
      setTimeout(() => {
        router.push("/products");
      }, 1000);
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
        {contextHolder}
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
                    <Col span={6}>
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
                    <Col span={6}>
                      <Form.Item label="Qtd. mínima">
                        <Input
                          value={product.min_quantity}
                          suffix={"unidades"}
                          disabled={isShow}
                          onChange={(e) =>
                            setProduct({
                              ...product,
                              min_quantity: Number(e.target.value),
                            })
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label="Preço">
                        <InputNumber
                          prefix="R$"
                          style={{ width: "100%" }}
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
