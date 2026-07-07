import { useEffect, useState } from "react";
import axios from "axios";
import { CarOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, Layout, Menu, Space, Typography, message } from "antd";
import CarFormModal from "./components/CarFormModal";
import CarTable from "./components/CarTable";
import type { Car } from "./types/car";

const { Header, Sider, Content } = Layout;

function App() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCarId, setEditingCarId] = useState<number | null>(null);

  const fetchCars = async () => {
    setLoading(true);

    try {
      const response = await axios.get<Car[]>("/cars");
      setCars(response.data);
    } catch {
      message.error("โหลดข้อมูลรถไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingCarId(null);
    setModalOpen(true);
  };

  const openEditModal = (id: number) => {
    setEditingCarId(id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCarId(null);
  };

  const handleSaved = async () => {
    closeModal();
    await fetchCars();
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/cars/${id}`);
      message.success("ลบข้อมูลรถแล้ว");
      await fetchCars();
    } catch {
      message.error("ลบข้อมูลรถไม่สำเร็จ");
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 8,
          colorBgLayout: "#f4f7fe",
          colorBorderSecondary: "#e2e8f0",
          fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
          fontSize: 14,
        },
        components: {
          Button: {
            controlHeight: 40,
            borderRadius: 8,
            fontWeight: 500,
          },
          Modal: {
            borderRadiusLG: 16,
            paddingMD: 24,
          },
          Table: {
            headerBg: "#f8fafc",
            headerColor: "#475569",
            rowHoverBg: "#f8fafc",
          }
        }
      }}
    >
      <Layout className="app-layout" hasSider>
        <Sider
          className="sidebar"
          width={248}
          theme="dark"
          breakpoint="lg"
          collapsedWidth={0}
        >
          <div className="sidebar-brand">
            <div className="brand-mark">c</div>
            <div>
              <Typography.Text strong>car management</Typography.Text>
              <Typography.Text type="secondary" className="brand-subtitle">
                Vehicle records
              </Typography.Text>
            </div>
          </div>

          <Menu
            className="sidebar-menu"
            theme="dark"
            mode="inline"
            selectedKeys={["cars"]}
            items={[
              {
                key: "cars",
                icon: <CarOutlined />,
                label: "รายการรถ"
              }
            ]}
          />
        </Sider>

        <Layout>
          <Header className="navbar">
            <Typography.Title level={5} style={{ margin: 0, color: '#1e293b', fontWeight: 600 }}>
              ระบบจัดการยานพาหนะ
            </Typography.Title>
          </Header>

          <Content className="main-content">
            <div className="page">
              <section className="page-title-row">
                <div>
                  <Typography.Title level={3} style={{ margin: 0 }}>รายการรถยนต์</Typography.Title>
                  <Typography.Text type="secondary" style={{ marginTop: 4, display: 'block' }}>
                    ข้อมูลรถยนต์ทั้งหมดของบริษัท
                  </Typography.Text>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
                  เพิ่มรถใหม่
                </Button>
              </section>

              <section className="content-panel">
                <div className="table-toolbar">
                  <Space direction="vertical" size={2}>
                    <Typography.Text strong>ทะเบียนรถ</Typography.Text>
                    <Typography.Text type="secondary">{cars.length} รายการ</Typography.Text>
                  </Space>
                </div>

                <CarTable
                  cars={cars}
                  loading={loading}
                  onAdd={openAddModal}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                />
              </section>
            </div>
          </Content>

          <CarFormModal
            open={modalOpen}
            carId={editingCarId}
            onClose={closeModal}
            onSaved={handleSaved}
          />
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
