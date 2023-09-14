import Dashboard from "@/components/Dashboard";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { Table } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaRegEye, FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import styles from "./styles.module.css";
import { ColumnsType } from "antd/es/table";

export default function Products() {
  const axios = useAxiosAuth();
  const [products, setProducts] = useState([]);
  const { data: session } = useSession();

  async function getProducts() {
    const response = (await axios.get("/customers")).data.customers;

    setProducts(response);
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
        <Link className={styles.containerIcons} href={`/products/${item.id}`}>
          <FaRegEye size={24} />
        </Link>
      ),
    },
    {
      title: "Editar",
      dataIndex: "",
      key: "x",
      width: "1%",
      render: (item: Customer) => (
        <Link className={styles.containerIcons} href={`/products/${item.id}`}>
          <FaPencilAlt size={24} />
        </Link>
      ),
    },
    {
      title: "Excluir",
      dataIndex: "",
      key: "x",
      width: "1%",
      render: () => (
        <button className={styles.containerIcons}>
          <FaTrashAlt color={"red"} size={24} />
        </button>
      ),
    },
  ];

  useEffect(() => {
    if (session?.user.accessToken) {
      getProducts();
    }
  }, [session?.user.accessToken]);

  return (
    <Dashboard>
      <h1>Clientes</h1>
      <Table dataSource={products} columns={columns} />
    </Dashboard>
  );
}
