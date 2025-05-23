"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConcernModel = void 0;
const mongoose_1 = require("mongoose");
const ConcernSchema = new mongoose_1.Schema({
    reporterId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    reportedMemberId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    status: {
        type: String,
        enum: ["Pending", "In Review", "Resolved", "Rejected"],
        default: "Pending",
    },
    resolutionNote: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.ConcernModel = (0, mongoose_1.model)("Concern", ConcernSchema);
