import express from "express";

import {
    registrarUsuario,
    confirmarCuenta,
    login,
    verify2FA,
} from "../controllers/usuarioController.js";

import {
    validarRegistro,
    validarLogin
} from "../validators/usuarioValidator.js";

import { manejarErrores } from "../middleware/manejadorErrores.js";

// con esto puedo usar los metodos http
const router = express.Router();

router.post('/registro', validarRegistro, manejarErrores, registrarUsuario);
router.get('/confirmar-cuenta/:token', confirmarCuenta);
router.post('/login', validarLogin, manejarErrores ,login);
router.post('/verify-2fa',verify2FA);



export default router;