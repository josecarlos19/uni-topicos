import Dashboard from "@/components/Dashboard";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { Table } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaRegEye, FaPencilAlt, FaTrashAlt } from "react-icons/fa";

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

  const columns = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "E-mail",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Visualizar",
      dataIndex: "",
      key: "x",
      render: (item: Customer) => (
        <Link href={`/products/${item.id}`}>
          <FaRegEye size={24} />
        </Link>
      ),
    },
    {
      title: "Editar",
      dataIndex: "",
      key: "x",
      render: (item: Customer) => (
        <Link href={`/products/${item.id}`}>
          <FaPencilAlt size={24} />
        </Link>
      ),
    },
    {
      title: "Excluir",
      dataIndex: "",
      key: "x",
      render: () => (
        <button
          style={{
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
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
