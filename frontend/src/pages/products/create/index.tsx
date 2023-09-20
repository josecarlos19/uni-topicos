import React, { useState } from "react";
import { Button, Col, Form, Input, InputNumber, Row, notification } from "antd";
import Dashboard from "@/components/Dashboard";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useRouter } from "next/router";
import { FaCheck } from "react-icons/fa";
import * as yup from "yup";
import { useFormWithSchema } from "@/lib/hooks/useFormWithSchema";
import { Controller } from "react-hook-form";

const productYupSchema = yup.object({
  name: yup.string().required("O nome é obrigatório"),
  description: yup.string().required("A descrição é obrigatória"),
  quantity: yup.number().required("A quantidade é obrigatória"),
  price: yup.number().required("O preço é obrigatório"),
  category: yup.string().required("A categoria é obrigatória"),
  type: yup.string().required("O tipo é obrigatório"),
});

type Product = yup.InferType<typeof productYupSchema>;

export default function Create() {
  const [isLoad, setIsLoad] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useFormWithSchema<Product>(productYupSchema);

  const router = useRouter();
  const axios = useAxiosAuth();

  const [api, contextHolder] = notification.useNotification();

  const openNotification = () => {
    api.open({
      message: "Sucesso!",
      duration: 2,
      description:
        "O produto foi criado! com sucesso. Você será redirecionado.",
      icon: <FaCheck size={24} color={"#3ddf14"} />,
    });
  };

  async function submit(product: Product) {
    console.log("submit");
    setIsLoad(true);
    await axios.post("/products", product);
    setIsLoad(false);
    openNotification();
    setTimeout(() => {
      router.push("/products");
    }, 2000);
  }

  return (
    <Dashboard>
      <div>
        {contextHolder}
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
                  <Form.Item
                    label="Nome"
                    validateStatus={errors.name ? "error" : "success"}
                    help={errors.name?.message}
                  >
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <Input {...field} required={true} />
                      )}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Descrição"
                    validateStatus={errors.description ? "error" : "success"}
                    help={errors.description?.message}
                  >
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <Input {...field} required={true} />
                      )}
                    />
                  </Form.Item>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="Quantidade"
                        validateStatus={errors.quantity ? "error" : "success"}
                        help={errors.quantity?.message}
                      >
                        <Controller
                          name="quantity"
                          control={control}
                          render={({ field }) => (
                            <Input {...field} required={true} type="number" />
                          )}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Preço"
                        validateStatus={errors.price ? "error" : "success"}
                        help={
                          errors.price?.message ? "O preço é obrigatório" : ""
                        }
                      >
                        <Controller
                          name="price"
                          control={control}
                          render={({ field }) => (
                            <InputNumber
                              {...field}
                              required={true}
                              type="number"
                              precision={2}
                              prefix="R$"
                            />
                          )}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col>
                      <Form.Item
                        label="Categoria"
                        validateStatus={errors.category ? "error" : "success"}
                        help={errors.category?.message}
                      >
                        <Controller
                          name="category"
                          control={control}
                          render={({ field }) => (
                            <Input {...field} required={true} />
                          )}
                        />
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item
                        label="Tipo"
                        validateStatus={errors.type ? "error" : "success"}
                        help={errors.type?.message}
                      >
                        <Controller
                          name="type"
                          control={control}
                          render={({ field }) => (
                            <Input {...field} required={true} />
                          )}
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
                  <Button
                    type="primary"
                    onClick={handleSubmit(submit)}
                    size={"middle"}
                  >
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
