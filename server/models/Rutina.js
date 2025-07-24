import mongoose from "mongoose";

const rutinaSchecma = mongoose.Schema({
    name: { type: String, required: true },
    descrip: { type: String },
    exercises: [{
        exerciseId: { type: mongoose.Schema.Types.ObjectId, required: true, ref:'Exercise' }, // Referencia al Ejercicio
        series: { type: Number },
        repeticiones: { type: Number },
        duracion: { type: Number },     // Para ejercicios de tiempo (segundos)
        descanso: { type: String }      // Descanso entre series
    }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true },    // Referencia al usuario que la creó
    isActive: {type:Boolean, default:true}
    },
    {
        timestamps: true
    }
);

const Rutina = mongoose.model("Rutina",rutinaSchecma);

export default Rutina;