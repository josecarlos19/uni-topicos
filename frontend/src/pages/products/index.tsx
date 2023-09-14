import Dashboard from "@/components/Dashboard";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { Table } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaRegEye, FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import styles from "./styles.module.css";

export default function Products() {
  const axios = useAxiosAuth();
  const [products, setProducts] = useState([]);
  const { data: session } = useSession();

  interface Product {
    id: string;
    name: string;
    description: string;
    quantity: number;
    price: number;
    category: string;
    type: string;
  }

  async function getProducts() {
    const response = (await axios.get("/products")).data.products;

    setProducts(response);
  }

  useEffect(() => {
    if (session?.user.accessToken) {
      getProducts();
    }
  }, [session?.user.accessToken]);

  const columns = [
    {
      title: "Código",
      dataIndex: "id",
      key: "id",
      width: "1%",
    },
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
      width: "10%",
    },
    {
      title: "Descrição",
      dataIndex: "description",
      key: "description",
      width: "10%",
    },
    {
      title: "Quantidade (Unidades)",
      dataIndex: "quantity",
      key: "quantity",
      width: "1%",
    },
    {
      title: "Preço (R$)",
      dataIndex: "price",
      key: "price",
      width: "5%",
    },
    {
      title: "Categoria",
      dataIndex: "category",
      key: "category",
      width: "5%",
    },
    {
      title: "Tipo",
      dataIndex: "type",
      key: "type",
      width: "5%",
    },
    {
      title: "Visualizar",
      dataIndex: "",
      key: "x",
      width: "5%",
      render: (item: Product) => (
        <Link className={styles.containerIcons} href={`/products/${item.id}`}>
          <FaRegEye size={24} />
        </Link>
      ),
    },
    {
      title: "Editar",
      dataIndex: "",
      key: "x",
      width: "5%",
      render: (item: Product) => (
        <Link className={styles.containerIcons} href={`/products/${item.id}`}>
          <FaPencilAlt size={24} />
        </Link>
      ),
    },
    {
      title: "Excluir",
      dataIndex: "",
      key: "x",
      width: "5%",
      render: () => (
        <button className={styles.containerIcons}>
          <FaTrashAlt color={"red"} size={24} />
        </button>
      ),
    },
  ];

  return (
    <Dashboard>
      <h1>Produtos</h1>
      <Table dataSource={products} columns={columns} />
    </Dashboard>
  );
}
