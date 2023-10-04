import Dashboard from "@/components/Dashboard";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { Button, Col, Popconfirm, Row, Table, message } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaRegEye, FaTrashAlt } from "react-icons/fa";
import styles from "./styles.module.css";
import { ColumnsType } from "antd/es/table";
import { useRouter } from "next/router";

export default function Customers() {
  const axios = useAxiosAuth();
  const [customers, setCustomers] = useState([]);
  const { data: session } = useSession();
  const router = useRouter();

  async function getCustomers() {
    const response = (await axios.get("/customers")).data.customers;

    setCustomers(response);
  }

  async function deleteItem(e: string) {
    await axios.delete(`/customers/${e}`);
    message.success("Cliente excluído com sucesso!");
    getCustomers();
  }

  interface Customer {
    id: string;
    name: string;
    email: string;
  }

  const columns: ColumnsType<Customer> = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
      width: "10%",
    },
    {
      title: "E-mail",
      dataIndex: "email",
      key: "email",
      width: "10%",
    },
    {
      title: "Criado em",
      dataIndex: "created_at",
      key: "created_at",
      width: "5%",
    },
    {
      title: "Visualizar",
      dataIndex: "",
      key: "x",
      width: "1%",
      render: (item: Customer) => (
        <Link className={styles.containerIcons} href={`/customers/${item.id}`}>
          <FaRegEye size={24} />
        </Link>
      ),
    },
    {
      title: "Excluir",
      dataIndex: "",
      key: "x",
      width: "5%",
      responsive: ["md"],
      render: (item: Customer) => (
        <Popconfirm
          title="Deletar produto?"
          description="Essa ação não pode ser desfeita."
          onConfirm={() => deleteItem(item.id)}
          okText="Sim, deletar"
          cancelText="Não, cancelar"
        >
          <button className={styles.containerIcons}>
            <FaTrashAlt color={"red"} size={24} />
          </button>
        </Popconfirm>
      ),
    },
  ];

  useEffect(() => {
    if (session?.user.accessToken) {
      getCustomers();
    }
  }, [session?.user.accessToken]);

  return (
    <Dashboard>
      <Row justify={"space-between"} align={"middle"}>
        <Col>
          <h1>Clientes</h1>
        </Col>
        <Col>
          <Button onClick={() => router.push("/customers/create")} type="link">
            Cadastrar cliente
          </Button>
        </Col>
      </Row>
      <Table
        rowKey={(record: Customer) => record.id}
        dataSource={customers}
        columns={columns}
      />
    </Dashboard>
  );
}
