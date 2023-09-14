import Dashboard from "@/components/Dashboard";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { Table } from "antd";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
const { Column } = Table;

export default function Products() {
  const axios = useAxiosAuth();
  const [products, setProducts] = useState([]);
  const { data: session } = useSession();

  async function getProducts() {
    const response = (await axios.get("/products")).data.products;

    setProducts(response);
  }

  useEffect(() => {
    if (session?.user.accessToken) {
      getProducts();
    }
  }, [session?.user.accessToken]);

  return (
    <Dashboard>
      <h1>Relatórios</h1>
      <Table dataSource={products}>
        <Column title="Nome" dataIndex="name" key="name" />
        <Column title="Descrição" dataIndex="description" key="description" />
        <Column title="Quantidade" dataIndex="quantity" key="quantity" />
        <Column title="Preço" dataIndex="price" key="price" />
        <Column title="Categoria" dataIndex="category" key="category" />
        <Column title="Tipo" dataIndex="type" key="type" />
      </Table>
    </Dashboard>
  );
}
