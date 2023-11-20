import { Dropdown, Space } from "antd";
import { signOut, useSession } from "next-auth/react";
import styles from "./styles.module.css";
import { FaAngleDown } from "react-icons/fa";

const items = [
  {
    key: "1",
    label: (
      <a
        onClick={() =>
          signOut({
            redirect: true,
            callbackUrl: "/login",
          })
        }
      >
        Sair
      </a>
    ),
  },
];

const DropDown = () => {
  const { data: session } = useSession();
  return (
    <Dropdown menu={{ items }}>
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <span className={styles.userText}> Olá, {session?.user?.name}</span>
          <FaAngleDown color="#021524" />
        </Space>
      </a>
    </Dropdown>
  );
};

export default DropDown;
