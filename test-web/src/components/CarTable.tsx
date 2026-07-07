import { Button, Popconfirm, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Car } from "../types/car";

type Props = {
  cars: Car[];
  loading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

function CarTable({ cars, loading, onEdit, onDelete }: Props) {
  const columns: ColumnsType<Car> = [
    {
      title: "ป้ายทะเบียน",
      dataIndex: "licensePlate",
      key: "licensePlate"
    },
    {
      title: "ยี่ห้อ",
      dataIndex: "brand",
      key: "brand"
    },
    {
      title: "รุ่น",
      dataIndex: "model",
      key: "model"
    },
    {
      title: "หมายเหตุ",
      dataIndex: "note",
      key: "note",
      render: (note: string | null) => note || "-"
    },
    {
      title: "วันที่เพิ่ม",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) => new Date(createdAt).toLocaleDateString("th-TH")
    },
    {
      title: "จัดการ",
      key: "actions",
      render: (_, car) => (
        <Space>
          <Button onClick={() => onEdit(car.id)}>แก้ไข</Button>
          <Popconfirm
            title="ลบรถ"
            description="ยืนยันลบข้อมูลรถคันนี้หรือไม่"
            okText="ลบ"
            cancelText="ยกเลิก"
            onConfirm={() => onDelete(car.id)}
          >
            <Button danger>ลบ</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={cars}
      loading={loading}
      pagination={false}
    />
  );
}

export default CarTable;
