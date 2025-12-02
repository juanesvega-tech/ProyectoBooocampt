import express from "express";
import { register, login, getUsers, getRepartidores  } from "../controllers/userController.js";

const router = express.Router();

// Rutas públicas
router.post("/register", register);
router.post("/login", login);   // 👈 AQUÍ ESTÁ LA RUTA /login

// Rutas protegidas (opcional)
router.get("/", getUsers);
router.get("/repartidores", getRepartidores);


export default router;


