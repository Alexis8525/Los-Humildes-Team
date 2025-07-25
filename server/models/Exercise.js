import mongoose from "mongoose";

const excercise = mongoose.Schema(
    {
        createdBy: { type: mongoose.Schema.Types.ObjectId, required: true },
        name: { type: String, required:true },
        muscleGroups: { type: [String], required:true }, // ["piernas", "espalda", "pecho"]
        equipmentRequired: { type: String, required:true }, // ["pesas", "bandas", "ninguno"]
        difficulty: { type: String, required:true }, // "fácil", "medio", "difícil"
        videoUrl: { type: String }, // (opcional)
        visibility: { type:String, default:'system'}, //system || private
        isActive: { type: Boolean, default:true }
    },
    {
        timestamps: true
    }
);


const Exercise = mongoose.model("Exercise", excercise);


export default Exercise;