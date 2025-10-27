import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { authRouter } from "./routers/authRouter";
import { balanceRouter } from "./routers/balanceRouter";
import { getterEventRouter } from "./routers/eventGetterRouter";
import { eventRouter } from "./routers/eventRouter";

const app = express();
const port = 3000;

// Middleware global
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // Cambiar según tu front
    credentials: true,
  })
);

app.use("/auth", authRouter);
app.use("/balance", balanceRouter);
app.use("/event", eventRouter);
app.use("/getter", getterEventRouter);

// Ruta raíz (opcional)
app.get("/", (req, res) => {
  res.send("🚀 API funcionando correctamente con Express y TypeScript");
});

// Manejo global de errores 404
app.use((req, res) => {
  res.status(404).send({ error: "Ruta no encontrada" });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
