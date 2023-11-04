import React, { useState } from "react";
import { Button, Col, Form, Input, Row, notification } from "antd";
import Dashboard from "@/components/Dashboard";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useRouter } from "next/router";
import { FaCheck } from "react-icons/fa";
import * as yup from "yup";
import { useFormWithSchema } from "@/lib/hooks/useFormWithSchema";
import { Controller } from "react-hook-form";

const CustomerYupSchema = yup.object({
  name: yup.string().required("O nome é obrigatório"),
  email: yup
    .string()
    .email("Digite um e-mail válido")
    .required("O e-mail é obrigatório"),
});

type Customer = yup.InferType<typeof CustomerYupSchema>;

export default function Create() {
  const [isLoad, setIsLoad] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useFormWithSchema<Customer>(CustomerYupSchema);

  const router = useRouter();
  const axios = useAxiosAuth();

  const [api, contextHolder] = notification.useNotification();

  const openNotification = () => {
    api.open({
      message: "Sucesso!",
      duration: 2,
      description:
        "O cliente foi criado! com sucesso. Você será redirecionado.",
      icon: <FaCheck size={24} color={"#3ddf14"} />,
    });
  };

  async function submit(Customer: Customer) {
    setIsLoad(true);
    await axios.post("/customers", Customer);
    setIsLoad(false);
    openNotification();
    setTimeout(() => {
      router.push("/customers");
    }, 1000);
  }

  return (
    <Dashboard>
      <div>
        {contextHolder}
        <h1>Cadastrar cliente</h1>

        <Row justify={"center"}>
          <Col>
            <Form
              labelCol={{ span: "auto" }}
              wrapperCol={{ span: "auto" }}
              layout="vertical"
              style={{ minWidth: 600 }}
            >
              <Row>
                <Col>
                  <Form.Item
                    label="Nome"
                    style={{ minWidth: 600 }}
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
                    label="E-mail"
                    validateStatus={errors.email ? "error" : "success"}
                    help={errors.email?.message}
                  >
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <Input {...field} required={true} />
                      )}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row justify={"space-between"}>
                <Col span={8}>
                  <Button
                    onClick={() => router.push("/customers")}
                    type="primary"
                    size={"middle"}
                  >
                    Voltar
                  </Button>
                </Col>
                <Col>
                  <Button
                    type="primary"
                    onClick={handleSubmit(submit)}
                    size={"middle"}
                  >
                    {isLoad ? "Carregando..." : "Cadastrar"}
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
