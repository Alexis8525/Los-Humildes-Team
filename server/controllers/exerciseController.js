import Exercise from "../models/Exercise.js";
import { Respuesta } from "../models/Respuesta.js";


const addExercise = async (req, res) => {
    let respuesta = new Respuesta();
    try {
        const { _id: createdBy, role } = req.usuario;
        const { name, muscleGroups, equipmentRequired, difficulty } = req.body;

        const exists = await Exercise.findOne({ name: name.toLowerCase(), createdBy });

        if (exists && !exists.isActive) {
            exists.isActive = true;
            await exists.save();
            respuesta.status = 'success';
            respuesta.msg = 'Ejercicio reestablecido';
            respuesta.data = exists;
            return res.status(200).json(respuesta);
        }

        if (exists && exists.isActive) {
            respuesta.status = 'error';
            respuesta.msg = 'Ya tienes un ejercicio con ese nombre';
            return res.status(400).json(respuesta);
        }

        const nwExercise = new Exercise({
            name: name.toLowerCase(),
            muscleGroups,
            equipmentRequired,
            difficulty,
            createdBy,
            visibility: role === 'Cliente' ? 'private' : 'system'
        })

        console.log(nwExercise);
        await nwExercise.save();

        respuesta.status = 'success';
        respuesta.msg = 'Nuevo ejercicio agregado correctamente';
        respuesta.data = nwExercise;

        return res.status(200).json(respuesta);

    } catch (error) {
        console.log(error);

        respuesta.status = 'error';
        respuesta.msg = 'Error al agregar ejercicio';
        respuesta.data = error.message;
        return res.status(500).json(respuesta);
    }
}

const listExcercisesByUserAndSystem = async (req, res) => {
    let respuesta = new Respuesta();

    try {
        const { _id: createdBy } = req.usuario;
        const exercises = await Exercise.find({
            $or: [
                { createdBy, isActive: true },
                { visibility: 'system', isActive: true }
            ]
        });
        //console.log(exercises);
        respuesta.status = 'success';
        respuesta.msg = 'Ejercicios del sistema y creados por el usuario';
        respuesta.data = exercises;

        return res.status(200).json(respuesta);
    } catch (error) {
        console.log(error);

        respuesta.status = 'error';
        respuesta.msg = 'Error al cargar los ejercicios';
        respuesta.data = error.message;
        return res.status(500).json(respuesta);
    }
}

const listExcercisesByUser = async (req, res) => {
    let respuesta = new Respuesta();

    try {
        const { _id: createdBy } = req.usuario;
        const exercises = await Exercise.find({ createdBy, isActive:true });
        //console.log(exercises);
        respuesta.status = 'success';
        respuesta.msg = 'Ejercicios creados por el usuario';
        respuesta.data = exercises;

        return res.status(200).json(respuesta);
    } catch (error) {
        console.log(error);

        respuesta.status = 'error';
        respuesta.msg = 'Error al cargar los ejercicios';
        respuesta.data = error.message;
        return res.status(500).json(respuesta);
    }
}

const listExcercisesBySystem = async (req, res) => {
    let respuesta = new Respuesta();

    try {
        const exercises = await Exercise.find({ visibility: 'system', isActive:true });
        //console.log(exercises);
        respuesta.status = 'success';
        respuesta.msg = 'Ejercicios del sistema';
        respuesta.data = exercises;

        return res.status(200).json(respuesta);
    } catch (error) {
        console.log(error);

        respuesta.status = 'error';
        respuesta.msg = 'Error al cargar los ejercicios';
        respuesta.data = error.message;
        return res.status(500).json(respuesta);
    }
}


const listAllExcercises = async (req, res) => {
    let respuesta = new Respuesta();

    try {
        const exercises = await Exercise.find();
        //console.log(exercises);
        respuesta.status = 'success';
        respuesta.msg = 'Todos los ejercicios';
        respuesta.data = exercises;

        return res.status(200).json(respuesta);
    } catch (error) {
        console.log(error);

        respuesta.status = 'error';
        respuesta.msg = 'Error al cargar los ejercicios';
        respuesta.data = error.message;
        return res.status(500).json(respuesta);
    }
}

const editExcercise = async (req, res) => {
    let respuesta = new Respuesta();

    try {
        const { id } = req.body;
        const { _id } = req.usuario;
        const exercise = await Exercise.findOne({ _id: id });

        if (!exercise) {
            respuesta.status = 'error';
            respuesta.msg = 'El ejercicio no existe';
            return res.status(404).json(respuesta);
        }

        if (exercise.createdBy.toString() != _id.toString()) {
            respuesta.status = 'error';
            respuesta.msg = 'No tienes permisos para editar este ejercicio';
            return res.status(403).json(respuesta);
        }

        console.log(exercise)

        exercise.name = req.body.name || exercise.name;
        exercise.muscleGroups = req.body.muscleGroups || exercise.muscleGroups;
        exercise.equipmentRequired = req.body.equipmentRequired || exercise.equipmentRequired;
        exercise.difficulty = req.body.difficulty || exercise.difficulty;

        await exercise.save();

        respuesta.status = 'success';
        respuesta.msg = 'Ejercicio actualizado correctamente';
        respuesta.data = exercise;
        return res.status(200).json(respuesta);

    } catch (error) {
        console.log(error);

        respuesta.status = 'error';
        respuesta.msg = 'Error al editar el ejercicio';
        respuesta.data = error.message;
        return res.status(500).json(respuesta);
    }
}

const deleteExercise = async (req,res) => {
    let respuesta = new Respuesta();
    try {
        const { id } = req.body;
        const { _id } = req.usuario;
        const exercise = await Exercise.findOne({ _id: id });

        if (!exercise) {
            respuesta.status = 'error';
            respuesta.msg = 'El ejercicio no existe';
            return res.status(404).json(respuesta);
        }

        if (exercise.createdBy.toString() != _id.toString()) {
            respuesta.status = 'error';
            respuesta.msg = 'No tienes permisos para eliminar este ejercicio';
            return res.status(403).json(respuesta);
        }

        exercise.isActive = false;
        await exercise.save();

        respuesta.status = 'success';
        respuesta.msg = 'Ejercicio eliminado correctamente';
        respuesta.data = exercise;
        return res.status(200).json(respuesta);

    } catch (error) {
        console.log(error);

        respuesta.status = 'error';
        respuesta.msg = 'Error al eliminar el ejercicio';
        respuesta.data = error.message;
        return res.status(500).json(respuesta);
    }
}



export {
    addExercise,
    listExcercisesByUserAndSystem,
    listExcercisesByUser,
    listExcercisesBySystem,
    listAllExcercises,
    editExcercise,
    deleteExercise
}