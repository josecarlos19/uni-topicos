import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Row,
  Select,
  notification,
  List,
  Card,
  Space,
  InputNumber,
  Divider,
} from "antd";
import { FaCheck, FaTrash } from "react-icons/fa";
import Dashboard from "@/components/Dashboard";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

interface OrderProduct {
  id: number;
  name?: string;
  quantity: number;
}

interface Order {
  customer_id: number;
  products: OrderProduct[];
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
  const [order, setOrder] = useState<Order>({} as Order);
  const [products, setProducts] = useState<Product[]>([]);
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([]);
  const [currentProduct, setCurrentProduct] = useState<OrderProduct>(
    {} as OrderProduct,
  );
  const [selected, setSelected] = useState<any>(null);

  const [customers, setCustomers] = useState<CustomerLabel[]>([]);

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
        "A venda foi realizada com sucesso. Você será redirecionado.",
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
    order!.products = orderProducts;

    setIsLoad(true);
    await axios.post("/financial/sell", order);
    setIsLoad(false);

    openNotification();
    setTimeout(() => {
      router.push("/orders");
    }, 1000);
  }

  const handleChangeCustomer = (value: string) => {
    setOrder({ ...order, customer_id: +value });
  };

  const handleSelectOrderProduct = (selectedProductId: number) => {
    const currentProduct = products.find(
      (product: Product) => product.id == selectedProductId,
    );

    setSelected(selectedProductId);

    if (currentProduct) {
      setCurrentProduct({
        id: currentProduct.id,
        name: currentProduct.name,
        quantity: 1,
      });
    }
  };

  const handleOrderProductQuantity = (quantity: any) => {
    setCurrentProduct({ ...currentProduct, quantity: quantity });
  };

  const handleAddProductToOrder = () => {
    setOrderProducts([...orderProducts, currentProduct]);

    setSelected(null);
    setCurrentProduct({} as OrderProduct);
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
          <Col style={{ minWidth: 600, maxWidth: 600 }}>
            <Row>
              <Col>
                <label>Cliente</label>
                <Select
                  style={{ width: "100%", paddingTop: "5px" }}
                  placeholder="Selecione um(a) cliente"
                  optionFilterProp="children"
                  onChange={handleChangeCustomer}
                  options={customers}
                  key={customers[0]?.value}
                />
              </Col>
            </Row>

            <Row style={{ paddingTop: "10px" }} gutter={16}>
              <Col span={10}>
                <label>Produtos</label>
                <Select
                  style={{ width: "100%", paddingTop: "5px" }}
                  value={selected}
                  placeholder="Selecione o produto"
                  optionFilterProp="children"
                  onChange={handleSelectOrderProduct}
                  options={products
                    .filter((product) => product.quantity > 0)
                    .map((product) => {
                      return {
                        value: String(product.id),
                        label: product.name + " - " + "R$ " + product.price,
                      };
                    })
                    .filter((product) => {
                      return (
                        orderProducts.find(
                          (orderProduct) => orderProduct.id == +product.value,
                        ) === undefined
                      );
                    })}
                />
              </Col>
              <Col span={6}>
                <label>Quantidade</label>
                <InputNumber
                  style={{ width: "100%", paddingTop: "5px" }}
                  disabled={currentProduct.id === undefined}
                  min={1}
                  max={
                    products.find((product) => product.id === currentProduct.id)
                      ?.quantity
                  }
                  defaultValue={0}
                  addonAfter="Un"
                  onChange={handleOrderProductQuantity}
                  value={currentProduct.quantity}
                />
              </Col>
              <Col span={6}>
                <label>Subtotal</label>

                <InputNumber
                  style={{ width: "100%", paddingTop: "5px" }}
                  disabled={true}
                  value={
                    (Number(
                      products.find(
                        (product: Product) => product.id == currentProduct.id,
                      )?.price,
                    ) *
                      currentProduct.quantity) |
                    0
                  }
                  addonBefore="R$"
                />
              </Col>
              <Row>
                <Col span={2}>
                  <Button
                    type="primary"
                    style={{ marginLeft: "9px", marginTop: "15px" }}
                    onClick={handleAddProductToOrder}
                    disabled={currentProduct.id === undefined}
                  >
                    Adicionar produto
                  </Button>
                </Col>
              </Row>
            </Row>

            <Row style={{ paddingTop: "20px" }}>
              <label style={{ paddingBottom: "10px" }}>
                Produtos selecionados: {orderProducts.length}
              </label>

              <Col span={24} style={{ overflow: "auto", height: "310px" }}>
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
                    <Card
                      style={{
                        marginTop: "10px",
                        marginBottom: "10px",
                        marginRight: "5px",
                        marginLeft: "5px",
                      }}
                      size="small"
                      title={item.name}
                      key={item.id}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        min={1}
                        disabled={true}
                        max={
                          products.find((product) => product.id === item.id)
                            ?.quantity
                        }
                        defaultValue={item.quantity}
                        addonAfter="Un"
                      />

                      <label
                        style={{
                          marginTop: "10px",
                          display: "block",
                          textAlign: "right",
                        }}
                      >
                        Preço:{" "}
                        {
                          products.find((product) => product.id === item.id)!
                            .price
                        }
                      </label>

                      <label
                        style={{
                          marginTop: "10px",
                          display: "block",
                          textAlign: "right",
                        }}
                      >
                        Subtotal R${" "}
                        {(
                          Number(
                            products.find((product) => product.id === item.id)
                              ?.price,
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
                      <Button
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                          boxShadow: "none",
                        }}
                        onClick={() =>
                          setOrderProducts(
                            orderProducts.filter(
                              (orderProduct) => orderProduct.id !== item.id,
                            ),
                          )
                        }
                      >
                        <FaTrash size={20} color={"#ff0000"} />
                      </Button>
                    </Card>
                  )}
                />
              </Col>
            </Row>

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
                  onClick={submit}
                  type="primary"
                  size={"middle"}
                  disabled={isLoad || order.customer_id === undefined}
                >
                  Confirmar venda
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </Dashboard>
  );
}
