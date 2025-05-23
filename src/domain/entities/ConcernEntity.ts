import { ObjectId } from "mongoose";

export class ConcernEntity {
  id?: string;
  reporterId!: ObjectId;
  reportedMemberId!: ObjectId;
  subject!: string;
  description!: string;
  status: "Pending" | "In Review" | "Resolved" | "Rejected" = "Pending";
  resolutionNote?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(init?: Partial<ConcernEntity>) {
    Object.assign(this, init);
  }
}
