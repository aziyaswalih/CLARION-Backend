import mongoose, { Schema, Document } from "mongoose";
import { Volunteer } from "../../../domain/entities/VolunteerEntity";

export interface VolunteerDocument extends Volunteer, Document {}

const VolunteerSchema = new Schema<VolunteerDocument>(
    {
        volunteerId: { type: Schema.Types.ObjectId,ref: 'User', required: true },
        skills: { type: [String] },
        motivation: { type: String },
        availability: {
            type: String,
            enum: ["part-time", "full-time"],
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model<VolunteerDocument>("Volunteer", VolunteerSchema);
