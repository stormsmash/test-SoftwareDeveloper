import { useEffect, useState } from "react";
import axios from "axios";
import { Button, ConfigProvider, Typography, message } from "antd";
import CarFormModal from "./components/CarFormModal";
import CarTable from "./components/CarTable";
import type { Car } from "./types/car";

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
    <ConfigProvider>
      <main className="page">
        <div className="page-header">
          <Typography.Title level={2}>รายการรถ</Typography.Title>
          <Button type="primary" onClick={openAddModal}>
            เพิ่มรถ
          </Button>
        </div>

        <CarTable cars={cars} loading={loading} onEdit={openEditModal} onDelete={handleDelete} />

        <CarFormModal
          open={modalOpen}
          carId={editingCarId}
          onClose={closeModal}
          onSaved={handleSaved}
        />
      </main>
    </ConfigProvider>
  );
}

export default App;
