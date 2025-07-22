import mongoose from "mongoose";

const twoFactorCode = mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, required: true },
        code: { type: String, required: true },
        expiresAt: { type: Date, required:true },
        ipAddress: { type: String },
        used: { type: Boolean, required:true }
    },
    {
        timestamps: true
    }
);

twoFactorCode.index({})

const TwoFactorCode = mongoose.model("TwoFactorCode", twoFactorCode);


export default TwoFactorCode;