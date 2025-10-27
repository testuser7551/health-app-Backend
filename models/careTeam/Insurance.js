import mongoose from "mongoose";

const insuranceSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        providerName: {
            type: String,
            required: true,
            trim: true,
        },
        coverageType: {
            type: String,
            enum: ["Medical", "Dental", "Vision", "Other"],
            default: "Medical",
        },
        policyNumber: {
            type: String,
            trim: true,
        },
        groupNumber: {
            type: String,
            trim: true,
        },
        memberId: {
            type: String,
            trim: true,
        },
        phoneNumber: {
            type: String,
            trim: true,
        },
        effectiveDate: {
            type: Date,
        },
        expirationDate: {
            type: Date,
        },
        notes: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

const Insurance = mongoose.model("Insurance", insuranceSchema);
export default Insurance;
