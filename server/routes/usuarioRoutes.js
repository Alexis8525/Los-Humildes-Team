import express from "express";

import { registrarUsuario } from "../controllers/usuarioController.js";
import { validarRegistro } from "../validators/usuarioValidator.js";
import { manejarErrores } from "../middleware/manejadorErrores.js";

// con esto puedo usar los metodos http
const router = express.Router();

router.post('/registro', validarRegistro, manejarErrores, registrarUsuario)


export default router;