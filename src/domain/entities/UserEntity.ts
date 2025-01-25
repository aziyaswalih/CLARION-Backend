import { ObjectId } from "mongoose";

export class UserEntity {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public phone: string,
    public isActive: boolean,
    public role: "admin" | "donor" | "volunteer" | "user",
    public is_verified: boolean,
    public password: string,
    public profilePic: string
  ) {}
}
