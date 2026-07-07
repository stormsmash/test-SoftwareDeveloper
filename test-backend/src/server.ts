import "dotenv/config";
import express from "express";
import carRoutes from "./routes/car.routes";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/cars", carRoutes);

app.get("/", (_req, res) => {
  res.send("Car management API");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
