import Dashboard from "@/components/Dashboard";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { Button, Col, Popconfirm, Row, Table, message } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaRegEye, FaTrashAlt } from "react-icons/fa";
import styles from "./styles.module.css";
import { useRouter } from "next/router";

export default function Products() {
  const axios = useAxiosAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

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
    const response = (await axios.get("/products")).data;

    setTotal(response.total);
    setProducts(response.products);
  }

  async function deleteItem(e: string) {
    await axios.delete(`/products/${e}`);
    message.success("Produto excluído com sucesso!");
    getProducts();
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
      responsive: ["md"],
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
      responsive: ["md"],
    },
    {
      title: "Quantidade (Unidades)",
      dataIndex: "quantity",
      key: "quantity",
      width: "1%",
      responsive: ["md"],
    },
    {
      title: "Preço (R$)",
      dataIndex: "price",
      key: "price",
      width: "5%",
      responsive: ["md"],
    },
    {
      title: "Categoria",
      dataIndex: "category",
      key: "category",
      width: "5%",
      responsive: ["md"],
    },
    {
      title: "Tipo",
      dataIndex: "type",
      key: "type",
      width: "5%",
      responsive: ["md"],
    },
    {
      title: "Detalhes",
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
      title: "Excluir",
      dataIndex: "",
      key: "x",
      width: "5%",
      responsive: ["md"],
      render: (item: Product) => (
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

  return (
    <Dashboard>
      <Row justify={"space-between"} align={"middle"}>
        <Col>
          <h1>Produtos</h1>
        </Col>
        <Col>
          <Button onClick={() => router.push("/products/create")} type="link">
            Criar produto
          </Button>
        </Col>
      </Row>
      <Table
        pagination={{
          current: page,
          pageSize: 10,
          total: total,
          onChange(page, pageSize) {
            setPage(page);
            axios
              .get(`/products?page=${page}&limit=${pageSize}`)
              .then((res) => {
                setProducts(res.data.products);
                setTotal(res.data.total);
              });
          },
        }}
        dataSource={products}
        columns={columns}
      />
    </Dashboard>
  );
}
