import prisma from "../prisma";

export type CarData = {
  licensePlate: string;
  brand: string;
  model: string;
  note: string | null;
};

export function getCars() {
  return prisma.car.findMany();
}

export function getCarById(id: number) {
  return prisma.car.findUnique({
    where: { id }
  });
}

export function createCar(data: CarData) {
  return prisma.car.create({
    data
  });
}

export function updateCar(id: number, data: CarData) {
  return prisma.car.update({
    where: { id },
    data
  });
}

export function deleteCar(id: number) {
  return prisma.car.delete({
    where: { id }
  });
}
