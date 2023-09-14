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
    const response = (await axios.get("/financial/buy-report")).data.records;

    setSells(response);
  }

  useEffect(() => {
    if (session?.user.accessToken) {
      getSells();
    }
  }, [session?.user.accessToken]);

  interface Sell {
    codigo_ordem: string;
    cliente: string;
  }

  const columns = [
    {
      title: "Código da compra",
      dataIndex: "codigo_ordem",
      key: "codigo_ordem",
    },
    {
      title: "Visualizar",
      dataIndex: "",
      key: "x",
      render: (item: Sell) => (
        <Link href={`/purchases/${item.codigo_ordem}`}>
          <FaRegEye size={24} />
        </Link>
      ),
    },
  ];

  return (
    <Dashboard>
      <h1>Compras</h1>
      <Table dataSource={sells} columns={columns} />
    </Dashboard>
  );
}
