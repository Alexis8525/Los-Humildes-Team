import mongoose from "mongoose";

const rutinaSemanalSchecma = mongoose.Schema({
    name: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true },    // Referencia al usuario que la creó
    rutinas: [{
        rutinaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Rutina' },     // Referencia a la Rutina (opcional)
        day: { type: Number},           // Dia para esta rutina 0-domingo
        exercises: [{
            exerciseId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Exercise' }, // Referencia al Ejercicio,
            series: { type: Number },
            repeticiones: { type: Number },
            duracion: { type: Number },     // Para ejercicios de tiempo (segundos)
            descanso: { type: String },      // Descanso entre series
            completado: { type: Boolean, default: false }, // Si se hizo o no
            notas: { type: String, default: "" }        // Observaciones del usuario
        }],
        completada: { type: Boolean, default: false },   // Si completó toda la rutina
        diaCompletada: { type: Date },   // dia que completó toda la rutina
    }],
    isActive: { type: Boolean, default: true }
},
    {
        timestamps: true
    }
);

const RutinaSemanal = mongoose.model("RutinaSemanal", rutinaSemanalSchecma, "rutinaSemanal");

export default RutinaSemanal;