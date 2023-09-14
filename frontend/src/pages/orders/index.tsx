import Dashboard from "@/components/Dashboard";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { Table } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaRegEye } from "react-icons/fa";

export default function Products() {
  const axios = useAxiosAuth();
  const [sells, setSells] = useState([]);
  const { data: session } = useSession();

  async function getSells() {
    const response = (await axios.get("/financial/sell-report")).data.records;

    setSells(response);
  }

  interface Order {
    codigo_ordem: string;
    cliente: string;
  }

  useEffect(() => {
    if (session?.user.accessToken) {
      getSells();
    }
  }, [session?.user.accessToken]);

  const columns = [
    {
      title: "Código da venda",
      dataIndex: "codigo_ordem",
      key: "codigo_ordem",
    },
    { title: "Cliente", dataIndex: "cliente", key: "cliente" },
    {
      title: "Visualizar",
      dataIndex: "",
      key: "x",
      render: (item: Order) => (
        <Link href={`/orders/${item.codigo_ordem}`}>
          <FaRegEye size={24} />
        </Link>
      ),
    },
  ];

  return (
    <Dashboard>
      <h1>Vendas</h1>
      <Table dataSource={sells} columns={columns} />
    </Dashboard>
  );
}
