import mongoose from "mongoose";

const preRegistroSchema = mongoose.Schema(
    {
        token: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const PreRegistro = mongoose.model("PreRegistro", preRegistroSchema);
export default PreRegistro;