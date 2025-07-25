import express from "express";

import checkAuth from "../middleware/chekAuth.js";
import { 
    createWeeklyRoutine,
    deleteWeeklyRoutine,
    getWeeklyRoutineById,
    listWeeklyRoutinesByUser,
    markDayAsCompleted,
    markExercisesCompleted,
    updateWeeklyRoutine,
    weeklySumary
} from "../controllers/rutinaSemanalController.js";

const router = express.Router();

router.post("/add",checkAuth,createWeeklyRoutine);
router.get("/list",checkAuth,listWeeklyRoutinesByUser);
router.get("/list/:id",checkAuth,getWeeklyRoutineById);
router.patch("/edit/:id",checkAuth,updateWeeklyRoutine);
router.delete("/delete/:id",checkAuth,deleteWeeklyRoutine);
router.patch("/completed/:weeklyRoutineId",checkAuth,markDayAsCompleted);
router.patch("/exer-completed/:weeklyRoutineId",checkAuth,markExercisesCompleted);
router.get("/:weeklyRoutineId/sumary",checkAuth,weeklySumary);


export default router;