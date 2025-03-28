import mongoose, { Document, Schema } from "mongoose";

interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface DonorDocument extends Document {
    donorId: mongoose.Schema.Types.ObjectId;
    address: Address;
}

const AddressSchema = new Schema<Address>({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
}, { _id: false });

const DonorSchema = new Schema<DonorDocument>({
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    address: { type: AddressSchema, required: false }
}, { timestamps: true });

const DonorModel = mongoose.model<DonorDocument>("Donor", DonorSchema);

export default DonorModel;
