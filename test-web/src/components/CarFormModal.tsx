import { useEffect, useState } from "react";
import axios from "axios";
import { Form, Input, Modal, message } from "antd";
import type { Car, CarFormValues } from "../types/car";

type Props = {
  open: boolean;
  carId: number | null;
  onClose: () => void;
  onSaved: () => void;
};

function getPayload(values: CarFormValues) {
  return {
    licensePlate: values.licensePlate.trim(),
    brand: values.brand.trim(),
    model: values.model.trim(),
    note: values.note?.trim() || null
  };
}

function CarFormModal({ open, carId, onClose, onSaved }: Props) {
  const [form] = Form.useForm<CarFormValues>();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const isEditMode = carId !== null;

  useEffect(() => {
    if (!open) return;

    form.resetFields();

    if (!carId) return;

    const fetchCar = async () => {
      setLoading(true);

      try {
        const response = await axios.get<Car>(`/cars/${carId}`);

        form.setFieldsValue({
          licensePlate: response.data.licensePlate,
          brand: response.data.brand,
          model: response.data.model,
          note: response.data.note || ""
        });
      } catch {
        message.error("โหลดข้อมูลรถไม่สำเร็จ");
        onClose();
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [open, carId, form]);

  const handleSubmit = async (values: CarFormValues) => {
    setSaving(true);

    try {
      if (isEditMode) {
        await axios.put(`/cars/${carId}`, getPayload(values));
        message.success("แก้ไขข้อมูลรถแล้ว");
      } else {
        await axios.post("/cars", getPayload(values));
        message.success("เพิ่มข้อมูลรถแล้ว");
      }

      onSaved();
    } catch {
      message.error(isEditMode ? "แก้ไขข้อมูลรถไม่สำเร็จ" : "เพิ่มข้อมูลรถไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={isEditMode ? "แก้ไขรถ" : "เพิ่มรถ"}
      open={open}
      okText="บันทึก"
      cancelText="ยกเลิก"
      confirmLoading={saving}
      okButtonProps={{ disabled: loading }}
      cancelButtonProps={{ disabled: saving }}
      onOk={() => form.submit()}
      onCancel={onClose}
      afterOpenChange={(visible) => {
        if (!visible) form.resetFields();
      }}
    >
      <Form
        form={form}
        layout="vertical"
        className="car-form"
        disabled={loading || saving}
        onFinish={handleSubmit}
      >
        <Form.Item
          label="ป้ายทะเบียน"
          name="licensePlate"
          rules={[{ required: true, message: "กรุณาใส่ป้ายทะเบียน" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="ยี่ห้อ"
          name="brand"
          rules={[{ required: true, message: "กรุณาใส่ยี่ห้อ" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="รุ่น"
          name="model"
          rules={[{ required: true, message: "กรุณาใส่รุ่น" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="หมายเหตุ" name="note">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default CarFormModal;
