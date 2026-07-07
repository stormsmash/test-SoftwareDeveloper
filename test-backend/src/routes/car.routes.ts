import { Router } from "express";
import {
  addCar,
  editCar,
  listCars,
  removeCar,
  showCar
} from "../controllers/car.controller";

const router = Router();

router.get("/", listCars);
router.get("/:id", showCar);
router.post("/", addCar);
router.put("/:id", editCar);
router.delete("/:id", removeCar);

export default router;
