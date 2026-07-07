import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Empty, Popconfirm, Space, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Car } from "../types/car";

type Props = {
  cars: Car[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

function CarTable({ cars, loading, onAdd, onEdit, onDelete }: Props) {
  const columns: ColumnsType<Car> = [
    {
      title: "ป้ายทะเบียน",
      dataIndex: "licensePlate",
      key: "licensePlate",
      render: (licensePlate: string) => <span className="license-plate">{licensePlate}</span>
    },
    {
      title: "ยี่ห้อ",
      dataIndex: "brand",
      key: "brand",
      filters: Array.from(new Set(cars.map((car) => car.brand))).map((brand) => ({
        text: brand,
        value: brand
      })),
      onFilter: (value, car) => car.brand === value
    },
    {
      title: "รุ่น",
      dataIndex: "model",
      key: "model",
      filters: Array.from(new Set(cars.map((car) => car.model))).map((model) => ({
        text: model,
        value: model
      })),
      onFilter: (value, car) => car.model === value
    },
    {
      title: "หมายเหตุ",
      dataIndex: "note",
      key: "note",
      ellipsis: true,
      render: (note: string | null) => (
        <Typography.Text type={note ? undefined : "secondary"}>{note || "-"}</Typography.Text>
      )
    },
    {
      title: "วันที่เพิ่ม",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 140,
      render: (createdAt: string) => (
        <Typography.Text className="date-text">
          {new Date(createdAt).toLocaleDateString("th-TH")}
        </Typography.Text>
      )
    },
    {
      title: "จัดการ",
      key: "actions",
      width: 180,
      render: (_, car) => (
        <Space size="middle">
          <Button size="small" type="text" icon={<EditOutlined />} onClick={() => onEdit(car.id)}>
            แก้ไข
          </Button>
          <Popconfirm
            title="ลบรถ"
            description="ยืนยันลบข้อมูลรถคันนี้หรือไม่"
            okText="ลบ"
            cancelText="ยกเลิก"
            onConfirm={() => onDelete(car.id)}
          >
            <Button size="small" type="text" danger icon={<DeleteOutlined />}>
              ลบ
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <Table
      className="car-table"
      rowKey="id"
      size="middle"
      columns={columns}
      dataSource={cars}
      loading={loading}
      locale={{
        emptyText: (
          <Empty description="ยังไม่มีข้อมูลรถ">
            <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
              เพิ่มรถคันแรก
            </Button>
          </Empty>
        )
      }}
      pagination={false}
    />
  );
}

export default CarTable;
