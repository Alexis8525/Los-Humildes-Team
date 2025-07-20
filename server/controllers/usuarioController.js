import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

import Usuario from "../models/Usuario.js";
import PreRegistro from "../models/PreRegistro.js";
import { generarId, generarJWT } from "../helpers/generarId.js";
import { emailRegistro } from "../helpers/email.js"

class Respuesta {
    status = '';
    msg = '';
    data = null;
}

// Función para registrar un nuevo usuario
const registrarUsuario = async (req, res) => {
    let respuesta = new Respuesta();

    try {
        const { name, lastN, email, pass } = req.body;
        console.log(req.body);
        // Verificar si el email ya está registrado
        const existeUsuario = await Usuario.findOne({ email });
        if (existeUsuario) {
            respuesta.status = 'error';
            respuesta.msg = 'El email ya está registrado';
            return res.status(400).json(respuesta);
        }
        
        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(pass, salt);
        
        // Crear el usuario
        //const usuario = new Usuario(req.body);
        //usuario.pass = hashedPassword;
        //console.log('Usuario nuevo \n', usuario);
        //await usuario.save();
        
        const payload = {
            name,
            lastN,
            email,
            pass: hashedPassword
        };
        console.log('Payload:\n',payload);

        const token = generarJWT(payload);
        console.log('Token:\n',token);

        const pre = new PreRegistro({token});
        console.log("Preregistro:\n",pre);
        
        
        pre.save()
        emailRegistro({ email, name, token:pre._id });
        
        respuesta.status = 'success';
        respuesta.msg = 'Registro completado, confirma tu cuenta para activarla';
        respuesta.data = null;
        return res.status(201).json(respuesta);

    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al registrar el usuario';
        respuesta.data = error.message;
        return res.status(500).json(respuesta);
    }
};

export {
    registrarUsuario
}