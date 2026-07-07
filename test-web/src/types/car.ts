export type Car = {
  id: number;
  licensePlate: string;
  brand: string;
  model: string;
  note: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CarFormValues = {
  licensePlate: string;
  brand: string;
  model: string;
  note?: string;
};
