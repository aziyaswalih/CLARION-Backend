// // import mongoose,{Document,Schema,ObjectId} from "mongoose";

// // const volunteerSchema = new mongoose.Schema({
// //     volunteerId:{type: Schema.Types.ObjectId},
// //     skills: { type: String },
// //     motivation: { type: String },
// //     availability: {
// //         type: String,
// //         enum: ["part-time", "full-time"],
// //         required: true,
// //     },
// // }, { timestamps: true });

// // const Volunteer = mongoose.model("Volunteer", volunteerSchema);
// // export default Volunteer;

// import mongoose, { Schema, Document } from "mongoose";

// // Define Volunteer interface
// interface IVolunteer extends Document {
//     volunteerId: Schema.Types.ObjectId;
//     skills?: string;
//     motivation?: string;
//     availability: "part-time" | "full-time";
// }

// // Define Volunteer schema
// const volunteerSchema = new Schema<IVolunteer>(
//     {
//         volunteerId: { type: Schema.Types.ObjectId, required: true, ref: "User" }, // Ensure reference to User collection
//         skills: { type: String },
//         motivation: { type: String },
//         availability: {
//             type: String,
//             enum: ["part-time", "full-time","weekends"],
//             required: true,
//         },
//     },
//     { timestamps: true }
// );

// // Create Volunteer model
// const Volunteer = mongoose.model<IVolunteer>("Volunteer", volunteerSchema);
// export default Volunteer;


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
