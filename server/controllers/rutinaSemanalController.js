import RutinaSemanal from "../models/RutinaSemanal.js";
import Rutina from "../models/Rutina.js";
import Exercise from "../models/Exercise.js";
import { Respuesta } from "../models/Respuesta.js";

const createWeeklyRoutine = async (req, res) => {
    let respuesta = new Respuesta();
    try {
        const { _id: createdBy } = req.usuario;
        const { name, rutinas } = req.body;

        // Verificar si ya existe una rutina semanal activa con el mismo nombre
        const existsWeeklyRoutine = await RutinaSemanal.findOne({
            name: name.toLowerCase(),
            createdBy,
        });

        if (existsWeeklyRoutine && existsWeeklyRoutine.isActive) {
            respuesta.status = 'error';
            respuesta.msg = 'Ya tienes una rutina semanal con ese nombre';
            return res.status(400).json(respuesta);
        }

        console.log(existsWeeklyRoutine);

        // Crear nueva rutina semanal
        let rutinasMaped = [];
        for (let rutina of rutinas || []) {
            const { day, rutinaId, exercises } = rutina;
            if (rutinaId && rutinaId.trim() !== "") {
                const routine = await Rutina.findOne({ _id: rutinaId, createdBy, isActive: true });
                //console.log("Con plantilla de rutina: ", rutinaId);
                if (routine) {
                    rutinasMaped = [...rutinasMaped, { day, rutinaId, exercises: [...exercises || [], ...routine.exercises] }]
                } else {
                    rutinasMaped = [...rutinasMaped, { day, rutinaId: null, exercises }];
                }

            } else {
                rutinasMaped = [...rutinasMaped, { day, rutinaId: rutinaId && rutinaId.trim() !== "" ? rutinaId : null, exercises }];
            }
        };

        const nwWeeklyRoutine = new RutinaSemanal({
            name: name.toLowerCase(),
            createdBy,
            rutinas: rutinasMaped,
        });

        console.log(nwWeeklyRoutine);

        //return res.json(nwWeeklyRoutine);

        await nwWeeklyRoutine.save();

        respuesta.status = 'success';
        respuesta.msg = 'Rutina semanal creada exitosamente';
        respuesta.data = nwWeeklyRoutine;

        return res.status(201).json(respuesta);

    } catch (error) {
        console.error(error);

        respuesta.status = 'error';
        respuesta.msg = 'Error al crear la rutina semanal';
        respuesta.data = error.message;
        return res.status(500).json(respuesta);
    }
}

const listWeeklyRoutinesByUser = async (req, res) => {
    let respuesta = new Respuesta();
    try {
        const { _id: createdBy } = req.usuario;

        const weeklyRoutines = await RutinaSemanal.find({ createdBy, isActive: true })
            .populate({
                path: 'rutinas.exercises.exerciseId',
                model: Exercise,
                select: '-createdBy -createdAt -updatedAt -__v -isActive -visibility'
            });

        respuesta.status = 'success';
        respuesta.msg = 'Todas tus rutinas semanales';
        respuesta.data = weeklyRoutines;

        return res.status(200).json(respuesta);

    } catch (error) {
        console.error(error);

        respuesta.status = 'error';
        respuesta.msg = 'Error al obtener las rutinas semanales';
        respuesta.data = error.message;
        return res.status(500).json(respuesta);
    }
}

const getWeeklyRoutineById = async (req, res) => {
    let respuesta = new Respuesta();
    try {
        const { _id: createdBy } = req.usuario;
        const { id } = req.params;

        const weeklyRoutine = await RutinaSemanal.findOne({
            _id: id,
            createdBy,
            isActive: true
        })
            .populate({
                path: 'rutinas.exercises.exerciseId',
                model: Exercise,
                select: '-createdBy -createdAt -updatedAt -__v -isActive -visibility'
            });

        if (!weeklyRoutine) {
            respuesta.status = 'error';
            respuesta.msg = 'No se encontró la rutina semanal';
            return res.status(404).json(respuesta);
        }

        respuesta.status = 'success';
        respuesta.msg = 'Rutina semanal encontrada';
        respuesta.data = weeklyRoutine;

        return res.status(200).json(respuesta);

    } catch (error) {
        console.error(error);

        respuesta.status = 'error';
        respuesta.msg = 'Error al obtener la rutina semanal';
        respuesta.data = error.message;
        return res.status(500).json(respuesta);
    }
}

const updateWeeklyRoutine = async (req, res) => {
    let respuesta = new Respuesta();
    try {
        const { _id: createdBy } = req.usuario;
        const { id } = req.params;
        const { rutinas, name } = req.body;

        const weeklyRoutine = await RutinaSemanal.findOne({
            _id: id,
            createdBy,
            isActive: true
        });

        if (!weeklyRoutine) {
            respuesta.status = 'error';
            respuesta.msg = 'No se encontró la rutina semanal';
            return res.status(404).json(respuesta);
        }

        // Actualizar las rutinas diarias

        // Crear nueva rutina semanal

        let rutinasMaped = [];
        if (rutinas) {

            for (let rutina of rutinas || []) {
                const { day, rutinaId, exercises } = rutina;
                if (rutinaId && rutinaId.trim() !== "") {
                    const routine = await Rutina.findOne({ _id: rutinaId, createdBy, isActive: true });
                    //console.log("Con plantilla de rutina: ", rutinaId);
                    if (routine) {
                        rutinasMaped = [...rutinasMaped, { day, rutinaId, exercises: [...exercises || [], ...routine.exercises] }]
                    } else {
                        rutinasMaped = [...rutinasMaped, { day, rutinaId: null, exercises }];
                    }

                } else {
                    rutinasMaped = [...rutinasMaped, { day, rutinaId: rutinaId && rutinaId.trim() !== "" ? rutinaId : null, exercises }];
                }
            };

        }

        if (name && name.toLowerCase() != weeklyRoutine.name) {

            const nameExists = await RutinaSemanal.findOne({
                name: name.toLowerCase(),
                createdBy,
                isActive: true
            });

            if (nameExists) {
                respuesta.status = 'error';
                respuesta.msg = 'Ya tienes una rutina con ese nombre';
                return res.status(409).json(respuesta);
            }
        }

        weeklyRoutine.name = req.body.name ? req.body.name.toLowerCase() : weeklyRoutine.name;
        weeklyRoutine.rutinas = rutinasMaped.length > 0 ? rutinasMaped : weeklyRoutine.rutinas;

        await weeklyRoutine.save();

        respuesta.status = 'success';
        respuesta.msg = 'Rutina semanal actualizada correctamente';
        respuesta.data = weeklyRoutine;

        return res.status(200).json(respuesta);

    } catch (error) {
        console.error(error);

        respuesta.status = 'error';
        respuesta.msg = 'Error al actualizar la rutina semanal';
        respuesta.data = error.message;
        return res.status(500).json(respuesta);
    }
}

const deleteWeeklyRoutine = async (req, res) => {
    let respuesta = new Respuesta();
    try {
        const { _id: createdBy } = req.usuario;
        const { id } = req.params;

        const weeklyRoutine = await RutinaSemanal.findOne({
            _id: id,
            createdBy
        });

        if (!weeklyRoutine) {
            respuesta.status = 'error';
            respuesta.msg = 'No se encontró la rutina semanal';
            return res.status(404).json(respuesta);
        }

        const deleted = await RutinaSemanal.deleteOne({ _id: id, createdBy });

        respuesta.status = 'success';
        respuesta.msg = 'Rutina semanal eliminada correctamente';
        respuesta.data = deleted;

        return res.status(200).json(respuesta);

    } catch (error) {
        console.error(error);

        respuesta.status = 'error';
        respuesta.msg = 'Error al eliminar la rutina semanal';
        respuesta.data = error.message;
        return res.status(500).json(respuesta);
    }
}

const markDayAsCompleted = async (req, res) => {
    let respuesta = new Respuesta();
    try {
        const { _id: createdBy } = req.usuario;
        const { weeklyRoutineId } = req.params;
        const { dayCompleted, completed } = req.body;

        const weeklyRoutine = await RutinaSemanal.findOne({
            _id: weeklyRoutineId,
            createdBy,
            isActive: true
        });


        if (!weeklyRoutine) {
            respuesta.status = 'error';
            respuesta.msg = 'No se encontró la rutina semanal';
            return res.status(404).json(respuesta);
        }


        // Actualizar estado de completado
        weeklyRoutine.rutinas.id({ _id: dayCompleted }).completada = completed;
        weeklyRoutine.rutinas.id({ _id: dayCompleted }).diaCompletada = new Date();

        console.log(weeklyRoutine.rutinas.id({ _id: dayCompleted }));

        await weeklyRoutine.save();

        respuesta.status = 'success';
        respuesta.msg = 'Día marcado como completado';
        respuesta.data = weeklyRoutine;

        return res.status(200).json(respuesta);

    } catch (error) {
        console.error(error);

        respuesta.status = 'error';
        respuesta.msg = 'Error al marcar el día como completado';
        respuesta.data = error.message;
        return res.status(500).json(respuesta);
    }
}

const markExercisesCompleted = async (req, res) => {
    let respuesta = new Respuesta();
    try {
        const { weeklyRoutineId } = req.params;
        const { _id: createdBy } = req.usuario;
        const { exerciseId, dayCompleted, notas, completed } = req.body;

        const rutina = await RutinaSemanal.findOne({
            _id: weeklyRoutineId,
            createdBy
        })

        if (!rutina) {
            respuesta.status = 'error';
            respuesta.msg = 'No se encotró la rutina';
            return res.status(404).json(respuesta);
        }

        rutina.rutinas.id({ _id: dayCompleted }).exercises.id({ _id: exerciseId }).completado = completed;

        rutina.rutinas.id({ _id: dayCompleted }).exercises.id({ _id: exerciseId }).notas = notas || '';

        console.log(rutina.rutinas.id({ _id: dayCompleted }).exercises.id({
            _id:
                exerciseId
        }));

        await rutina.save();

        respuesta.status = 'success';
        respuesta.msg = 'Ejercicio marcado como completado';
        respuesta.data = rutina;

        return res.status(200).json(respuesta);

    } catch (error) {
        console.error(error);

        respuesta.status = 'error';
        respuesta.msg = 'Error al marcar el ejercicio como completado';
        respuesta.data = error.message;
        return res.status(500).json(respuesta);
    }
}

export {
    createWeeklyRoutine,
    listWeeklyRoutinesByUser,
    getWeeklyRoutineById,
    updateWeeklyRoutine,
    deleteWeeklyRoutine,
    markDayAsCompleted,
    markExercisesCompleted
}