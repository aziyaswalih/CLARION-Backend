import { ObjectId } from "mongoose";

export class UserEntity {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public phone: string,
    public isActive: boolean,
    public role: "admin" | "donor" | "volunteer" | "user",
    public password: string,
    public profilePic: string
  ) {}
}
