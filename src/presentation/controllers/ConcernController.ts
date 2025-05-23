import { Request, Response } from "express";
import { ConcernRepository } from "../../infrastructure/repositories/concerns/ConcernMongoRepository";
import jwt, { JwtPayload } from "jsonwebtoken";
const concernRepo = new ConcernRepository();
interface CustomJwtPayload extends JwtPayload {
  id: string;
}
export class ConcernController {
  async create(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ message: "Unauthorized" });
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as CustomJwtPayload;
      const userId = decoded.id;
      const concern = await concernRepo.createConcern({
        ...req.body,
        reporterId: userId,
      });
      res.status(201).json(concern);
    } catch (err) {
      res.status(400).json({ error: "Error creating concern", details: err });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const concerns = await concernRepo.getAllConcerns();
      res.json(concerns);
    } catch (err) {
      res.status(500).json({ error: "Error fetching concerns" });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const concern = await concernRepo.getConcernById(req.params.id);
      if (!concern)
        return res.status(404).json({ message: "Concern not found" });
      res.json(concern);
    } catch (err) {
      res.status(500).json({ error: "Error fetching concern" });
    }
  }

  async updateStatus(req: Request, res: Response) {
    const { status, resolutionNote } = req.body;
    try {
      const updated = await concernRepo.updateConcernStatus(
        req.params.id,
        status,
        resolutionNote
      );
      if (!updated)
        return res.status(404).json({ message: "Concern not found" });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: "Error updating concern", details: err });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const deleted = await concernRepo.deleteConcern(req.params.id);
      if (!deleted)
        return res.status(404).json({ message: "Concern not found" });
      res.json({ message: "Concern deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Error deleting concern" });
    }
  }
}
