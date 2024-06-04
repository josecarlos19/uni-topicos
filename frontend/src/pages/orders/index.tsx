import Dashboard from "@/components/Dashboard";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { Button, Col, Popconfirm, Row, Table } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaRegEye, FaTrash } from "react-icons/fa";
import styles from "./styles.module.css";
import { useRouter } from "next/router";

export default function Products() {
  const axios = useAxiosAuth();
  const [orders, setSells] = useState([]);
  const { data: session } = useSession();
  const router = useRouter();

  async function getOrder() {
    const response = (await axios.get("/financial/sell-report")).data.records;

    setSells(response);
  }

  async function deleteOrder(id: string) {
    await axios.delete(`/financial/orders/${id}`);
    getOrder();
  }

  interface Order {
    codigo_ordem: string;
    cliente: string;
  }

  useEffect(() => {
    if (session?.user.accessToken) {
      getOrder();
    }
  }, [session?.user.accessToken]);

  const columns = [
    {
      title: "Código da venda",
      dataIndex: "codigo_ordem",
      key: "codigo_ordem",
      width: "10%",
    },
    { title: "Cliente", dataIndex: "comprador", key: "cliente" },
    { title: "Criada em", dataIndex: "created_at", key: "cliente" },
    {
      title: "Total (R$)",
      dataIndex: "total_ordem",
      key: "total_ordem",
    },
    {
      title: "Cancelar",
      dataIndex: "",
      key: "deleted_at",
      width: "10%",
      render: (item: any) =>
        !item.deleted_at ? (
          <Popconfirm
            title="Tem certeza que deseja cancelar esta venda?"
            onConfirm={() => deleteOrder(item.codigo_ordem)}
            okText="Sim"
            cancelText="Não"
          >
            <Button type="link">
              <FaTrash size={24} />
            </Button>
          </Popconfirm>
        ) : (
          "Cancelada"
        ),
    },
    {
      title: "Visualizar",
      dataIndex: "",
      key: "x",
      width: "10%",
      render: (item: Order) => (
        <Link
          className={styles.containerIcons}
          href={`/orders/${item.codigo_ordem}`}
        >
          <FaRegEye size={24} />
        </Link>
      ),
    },
  ];

  return (
    <Dashboard>
      <Row justify={"space-between"} align={"middle"}>
        <Col>
          <h1>Vendas</h1>
        </Col>
        <Col>
          <Button onClick={() => router.push("/orders/create")} type="link">
            Realizar venda
          </Button>
        </Col>
      </Row>
      <Table dataSource={orders} columns={columns} />
    </Dashboard>
  );
}
