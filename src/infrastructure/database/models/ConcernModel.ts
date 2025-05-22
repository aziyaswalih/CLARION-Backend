import { Schema, model, Document, ObjectId } from 'mongoose';
import { IUser } from './UserModel';

// models/Concern.ts

export interface IConcern extends Document {
    id: string;
    reporterId: ObjectId | IUser;           // Member who raised the concern
    reportedMemberId: ObjectId | IUser;    // Member against whom concern is raised         
    subject: string;
    description: string;
    status: 'Pending' | 'In Review' | 'Resolved' | 'Rejected';
    resolutionNote?: string;      // Final resolution summary
    createdAt: Date;
    updatedAt: Date;
}

const ConcernSchema = new Schema<IConcern>({
    reporterId: { type: Schema.Types.ObjectId,ref: 'User', required: true },
    reportedMemberId: { type: Schema.Types.ObjectId,ref: 'User', required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['Pending', 'In Review', 'Resolved', 'Rejected'], 
        default: 'Pending' 
    },
    resolutionNote: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

export const ConcernModel = model<IConcern>('Concern', ConcernSchema);