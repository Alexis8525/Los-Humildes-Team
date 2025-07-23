import express from "express";

import  checkAuth from "../middleware/chekAuth.js";
import {
    addExercise,
    listExcercisesByUserAndSystem,
    listExcercisesByUser,
    listExcercisesBySystem,
    listAllExcercises,
    editExcercise,
    deleteExercise
} from "../controllers/exerciseController.js";
import { checkRole } from "../middleware/checkRole.js";

const router = express.Router();

router.post("/add",checkAuth,addExercise);
router.get("/", checkAuth, listExcercisesByUserAndSystem);
router.get("/by-user", checkAuth, listExcercisesByUser);
router.get("/by-system", listExcercisesBySystem);
router.get("/all", checkAuth, checkRole ,listAllExcercises);
router.patch("/edit", checkAuth, editExcercise);
router.delete("/delete",checkAuth, deleteExercise)


export default router;