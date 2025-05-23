"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConcernController = void 0;
const ConcernMongoRepository_1 = require("../../infrastructure/repositories/concerns/ConcernMongoRepository");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const concernRepo = new ConcernMongoRepository_1.ConcernRepository();
class ConcernController {
    async create(req, res) {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token)
                return res.status(401).json({ message: "Unauthorized" });
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;
            const concern = await concernRepo.createConcern({
                ...req.body,
                reporterId: userId,
            });
            res.status(201).json(concern);
        }
        catch (err) {
            res.status(400).json({ error: "Error creating concern", details: err });
        }
    }
    async getAll(req, res) {
        try {
            const concerns = await concernRepo.getAllConcerns();
            res.json(concerns);
        }
        catch (err) {
            res.status(500).json({ error: "Error fetching concerns" });
        }
    }
    async getById(req, res) {
        try {
            const concern = await concernRepo.getConcernById(req.params.id);
            if (!concern)
                return res.status(404).json({ message: "Concern not found" });
            res.json(concern);
        }
        catch (err) {
            res.status(500).json({ error: "Error fetching concern" });
        }
    }
    async updateStatus(req, res) {
        const { status, resolutionNote } = req.body;
        try {
            const updated = await concernRepo.updateConcernStatus(req.params.id, status, resolutionNote);
            if (!updated)
                return res.status(404).json({ message: "Concern not found" });
            res.json(updated);
        }
        catch (err) {
            res.status(400).json({ error: "Error updating concern", details: err });
        }
    }
    async delete(req, res) {
        try {
            const deleted = await concernRepo.deleteConcern(req.params.id);
            if (!deleted)
                return res.status(404).json({ message: "Concern not found" });
            res.json({ message: "Concern deleted successfully" });
        }
        catch (err) {
            res.status(500).json({ error: "Error deleting concern" });
        }
    }
}
exports.ConcernController = ConcernController;
