import Rutina from "../models/Rutina.js";
import { Respuesta } from "../models/Respuesta.js";
import { model } from "mongoose";
import Exercise from "../models/Exercise.js";


const createRoutine = async (req, res) => {
    let respuesta = new Respuesta();
    try {
        const { _id: createdBy } = req.usuario;
        const { name, descrip, exercises } = req.body;

        const existsRoutine = await Rutina.findOne({ name: name.toLowerCase(), createdBy });
        console.log(existsRoutine);

        if (existsRoutine && existsRoutine.isActive) {
            respuesta.status = 'error';
            respuesta.msg = 'Ya tienes una rutina con ese nombre';
            return res.status(400).json(respuesta);
        }

        

        const nwRoutine = new Rutina({
            name: name.toLowerCase(),
            descrip,
            exercises,
            createdBy
        });

        console.log(nwRoutine)
        await nwRoutine.save();

        respuesta.status = 'success';
        respuesta.msg = 'Rutina creada exitosamente';
        respuesta.data = nwRoutine;

        return res.status(200).json(respuesta);

    } catch (error) {
        console.log(error);

        respuesta.status = 'error';
        respuesta.msg = 'Error al agregar ejercicio';
        respuesta.data = error.message;
        return res.status(500).json(respuesta);
    }
}

const listRoutinesByUser = async (req, res) => {
    let respuesta = new Respuesta();
    try {
        const { _id: createdBy } = req.usuario;
        const routines = await Rutina.find({ createdBy, isActive: true }).populate({ path: 'exercises.exerciseId', model: Exercise, select: '-createdBy -createdAt -updatedAt -__v -visibility -isActive' });

        respuesta.status = 'success';
        respuesta.msg = 'Todas tus rutinas';
        respuesta.data = routines;
        //console.log(routines);
        return res.status(200).json(respuesta);

    } catch (error) {
        console.log(error);

        respuesta.status = 'error';
        respuesta.msg = 'Error al obtener las rutinas';
        respuesta.data = error.message;
        return res.status(500).json(respuesta);
    }

}

const editRoutineByUser = async (req, res) => {
    let respuesta = new Respuesta();
    try {
        const { _id: createdBy } = req.usuario;
        const { id } = req.params;
        const { name } = req.body;

        const routine = await Rutina.findOne({ _id: id, createdBy, isActive: true }).populate({ path: 'exercises.exerciseId', model: Exercise, select: '-createdBy -createdAt -updatedAt -__v -visibility -isActive' });

        if (!routine) {
            respuesta.status = 'error';
            respuesta.msg = 'No se encontro la rutina';
            return res.status(404).json(respuesta);
        }

        console.log(routine);

        if (name && name.toLowerCase() != routine.name) {
            const nameExists = await Rutina.findOne({ name: name.toLowerCase(), createdBy, isActive: true });

            if (nameExists) {
                respuesta.status = 'error';
                respuesta.msg = 'Ya tienes una rutina con ese nombre';
                return res.status(409).json(respuesta);
            }

        }

        routine.name = req.body.name ? req.body.name.toLowerCase() : routine.name;
        routine.descrip = req.body.descrip || routine.descrip;
        routine.exercises = req.body.exercises || routine.exercises;

        console.log(routine);

        routine.save();

        respuesta.status = 'success';
        respuesta.msg = 'Rutina actualizada';
        respuesta.data = routine;

        return res.status(200).json(respuesta);

    } catch (error) {
        console.log(error);

        respuesta.status = 'error';
        respuesta.msg = 'Error al editar la rutina';
        respuesta.data = error.message;
        return res.status(500).json(respuesta);
    }
}

const deleteRoutineByUser = async (req, res) => {
    let respuesta = new Respuesta();
    try {
        const { _id: createdBy } = req.usuario;
        const { id } = req.params;

        const routine = await Rutina.findOne({ _id: id, createdBy });

        if (!routine) {
            respuesta.status = 'error';
            respuesta.msg = 'No se encontro la rutina';
            return res.status(404).json(respuesta);
        }

        console.log(routine);

        routine.isActive = false;
        await routine.save();

        respuesta.status = 'success';
        respuesta.msg = 'Rutina eliminada correctamente';
        respuesta.data = routine;

        return res.status(200).json(respuesta);

    } catch (error) {
        console.log(error);

        respuesta.status = 'error';
        respuesta.msg = 'Error al eliminar la rutina';
        respuesta.data = error.message;
        return res.status(500).json(respuesta);
    }
}

export {
    createRoutine,
    listRoutinesByUser,
    editRoutineByUser,
    deleteRoutineByUser
}