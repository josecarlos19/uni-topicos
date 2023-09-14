import Dashboard from "@/components/Dashboard";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { Table } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaRegEye } from "react-icons/fa";
import styles from "./styles.module.css";

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
      width: "10%",
    },
    {
      title: "Criada em",
      dataIndex: "created_at",
      key: "cliente",
    },
    { title: "Total (R$)", dataIndex: "total_ordem", key: "total_ordem" },
    {
      title: "Visualizar",
      dataIndex: "",
      key: "x",
      render: (item: Sell) => (
        <Link
          className={styles.containerIcons}
          href={`/purchases/${item.codigo_ordem}`}
        >
          <FaRegEye size={24} />
        </Link>
      ),
    },
  ];

  return (
    <Dashboard>
      <h1>Compras</h1>
      <Table
        dataSource={sells}
        columns={columns}
        pagination={{
          current: 1,
          pageSize: 10,
          onChange(page, pageSize) {
            console.log(page, pageSize);
            //api call triggered when number of pages changes
          },
        }}
      />
    </Dashboard>
  );
}
