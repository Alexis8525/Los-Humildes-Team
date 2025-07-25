import express from "express";

import checkAuth from "../middleware/chekAuth.js";
import {
    createRoutine,
    deleteRoutineByUser,
    editRoutineByUser,
    listRoutinesByUser
} from "../controllers/rutinaController.js";


const router = express.Router();

router.post("/add", checkAuth, createRoutine);
router.get("/list", checkAuth, listRoutinesByUser);
router.patch("/edit/:id", checkAuth, editRoutineByUser);
router.delete("/delete/:id", checkAuth, deleteRoutineByUser);

export default router;
