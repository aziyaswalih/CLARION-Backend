// import mongoose, { Schema, Document } from "mongoose";

// // Define an interface for Beneficiary Document
// export interface IBeneficiary extends Document {

//   name: string;
//   email: string;
//   phone: string;
//   password:string;
//   profilePic:string;
//   address: {
//     street: string;
//     city: string;
//     state: string;
//     zipCode: string;
//     country: string;
//   };
//   dateOfBirth: Date;
//   gender: "Male" | "Female" | "Other";
//   identification: {
//     type: string; // e.g., "Aadhar", "Passport", etc.
//     number: string;
//   };
//   familyDetails: {
//     membersCount: number;
//     incomeLevel: string; // e.g., "Below Poverty Line", "Middle Class"
//   };
//   role: 'admin' | 'donor' | 'volunteer' | 'user';
//   isActive:boolean;

//   createdAt: Date;
//   updatedAt: Date;
// }

// // Define the schema
// const BeneficiarySchema: Schema = new Schema(
//   {
//     name: { type: String, required: true, trim: true },
//     email: { type: String, required: true, unique: true, trim: true },
//     phone: { type: String, required: true, unique: true, trim: true },
//     password:{type:String, required:true},
//     profilePic:{type:String, default:""},
  
//     address: {
//       street: { type: String, required: true, trim: true },
//       city: { type: String, required: true, trim: true },
//       state: { type: String, required: true, trim: true },
//       zipCode: { type: String, required: true, trim: true },
//       country: { type: String, required: true, trim: true },
//     },
//     dateOfBirth: { type: Date, required: true },
//     gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
//     identification: {
//       type: { type: String, required: true, trim: true },
//       number: { type: String, required: true, trim: true, unique: true },
//     },
//     familyDetails: {
//       membersCount: { type: Number, required: true },
//       incomeLevel: { type: String, required: true, trim: true },
//     },
//     role:{
//         type:String,
//         enum:[ 'admin' , 'donor' , 'volunteer' , 'user'],
//         default:'user'

//     },
//     isActive:{
//         type:Boolean,
//         default:true
//     }
//   },
//   {
//     timestamps: true, // Automatically manage createdAt and updatedAt
//   }
// );

// // Create and export the model
// export const BeneficiaryModel = mongoose.model<IBeneficiary>(
//   "Beneficiary",
//   BeneficiarySchema
// );
import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

// Define an interface for Beneficiary Document
export interface IBeneficiary extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  profilePic: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  dateOfBirth: Date;
  gender: "Male" | "Female" | "Other";
  identification: {
    type: string;
    number: string;
  };
  familyDetails: {
    membersCount: number;
    incomeLevel: string;
  };
  role: "admin" | "donor" | "volunteer" | "user";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Define the schema
const BeneficiarySchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email validation
    },
    phone: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "" },
    address: {
      street: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      zipCode: { type: String, required: true, trim: true },
      country: { type: String, required: true, trim: true },
    },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    identification: {
      type: { type: String, required: true, trim: true },
      number: { type: String, required: true, trim: true, unique: true },
    },
    familyDetails: {
      membersCount: { type: Number, required: true },
      incomeLevel: { type: String, required: true, trim: true },
    },
    role: {
      type: String,
      enum: ["admin", "donor", "volunteer", "user"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Pre-save hook for password hashing
BeneficiarySchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.log(error);
    
  }
});

// Method to compare passwords
BeneficiarySchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create and export the model
export const BeneficiaryModel = mongoose.model<IBeneficiary>(
  "Beneficiary",
  BeneficiarySchema
);
