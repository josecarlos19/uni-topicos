import { Table } from "antd";
const { Column } = Table;

interface tableColumn {
  title: string;
  dataIndex: string;
  key: string;
}

interface Props {
  colums: tableColumn[];
  data: any[];
}

const TableComponent = ({ colums, data }: Props) => {
  console.log(colums);
  return (
    <Table dataSource={data}>
      {colums.map((column) => (
        <Column
          title={column.title}
          dataIndex={column.dataIndex}
          key={column.key}
        />
      ))}
    </Table>
  );
};

export default TableComponent;
