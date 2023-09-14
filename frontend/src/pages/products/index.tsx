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
    },
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Descrição",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Quantidade",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Preço",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Categoria",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Tipo",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Visualizar",
      dataIndex: "",
      key: "x",
      render: (item: Product) => (
        <Link href={`/products/${item.id}`}>
          <FaRegEye size={24} />
        </Link>
      ),
    },
    {
      title: "Editar",
      dataIndex: "",
      key: "x",
      render: (item: Product) => (
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

  return (
    <Dashboard>
      <h1>Produtos</h1>
      <Table dataSource={products} columns={columns} />
    </Dashboard>
  );
}
