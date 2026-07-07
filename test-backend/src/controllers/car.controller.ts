import { Request, Response } from "express";
import {
  createCar,
  deleteCar,
  getCarById,
  getCars,
  updateCar
} from "../services/car.service";

const requiredFields = ["licensePlate", "brand", "model"] as const;

function getId(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: "Invalid car id" });
    return null;
  }

  return id;
}

function validateCarBody(body: Record<string, unknown>) {
  const missingFields = requiredFields.filter((field) => {
    return typeof body[field] !== "string" || body[field].trim() === "";
  });

  if (missingFields.length > 0) {
    return `${missingFields.join(", ")} is required`;
  }

  if (body.note !== undefined && body.note !== null && typeof body.note !== "string") {
    return "note must be a string";
  }

  return null;
}

function getCarData(body: Record<string, unknown>) {
  return {
    licensePlate: String(body.licensePlate).trim(),
    brand: String(body.brand).trim(),
    model: String(body.model).trim(),
    note: typeof body.note === "string" ? body.note.trim() : null
  };
}

export async function listCars(_req: Request, res: Response) {
  try {
    const cars = await getCars();
    res.json(cars);
  } catch {
    res.status(500).json({ message: "Failed to get cars" });
  }
}

export async function showCar(req: Request, res: Response) {
  const id = getId(req, res);
  if (!id) return;

  try {
    const car = await getCarById(id);

    if (!car) {
      res.status(404).json({ message: "Car not found" });
      return;
    }

    res.json(car);
  } catch {
    res.status(500).json({ message: "Failed to get car" });
  }
}

export async function addCar(req: Request, res: Response) {
  const error = validateCarBody(req.body);

  if (error) {
    res.status(400).json({ message: error });
    return;
  }

  try {
    const car = await createCar(getCarData(req.body));
    res.status(201).json(car);
  } catch {
    res.status(500).json({ message: "Failed to create car" });
  }
}

export async function editCar(req: Request, res: Response) {
  const id = getId(req, res);
  if (!id) return;

  const error = validateCarBody(req.body);

  if (error) {
    res.status(400).json({ message: error });
    return;
  }

  try {
    const car = await getCarById(id);

    if (!car) {
      res.status(404).json({ message: "Car not found" });
      return;
    }

    const updatedCar = await updateCar(id, getCarData(req.body));
    res.json(updatedCar);
  } catch {
    res.status(500).json({ message: "Failed to update car" });
  }
}

export async function removeCar(req: Request, res: Response) {
  const id = getId(req, res);
  if (!id) return;

  try {
    const car = await getCarById(id);

    if (!car) {
      res.status(404).json({ message: "Car not found" });
      return;
    }

    await deleteCar(id);
    res.status(204).send();
  } catch {
    res.status(500).json({ message: "Failed to delete car" });
  }
}
