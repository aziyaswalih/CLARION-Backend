"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryUseCase = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const StoryModel_1 = __importDefault(require("../../../infrastructure/database/models/StoryModel"));
const httpStatus_1 = require("../../../constants/httpStatus");
const BeneficiaryUseCase_1 = require("../beneficiary/BeneficiaryUseCase");
const BeneficiaryMongoRepository_1 = require("../../../infrastructure/repositories/beneficiary/BeneficiaryMongoRepository");
const app_1 = require("../../../app");
const beneficiaryRepository = new BeneficiaryMongoRepository_1.BeneficiaryMongoRepository();
const beneficiaryUseCase = new BeneficiaryUseCase_1.GetBeneficiaryUseCase(beneficiaryRepository);
class StoryUseCase {
    async decodeToken(req) {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token)
            throw {
                status: httpStatus_1.HttpStatus.UNAUTHORIZED,
                message: "Access token is missing",
            };
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        return decoded.id;
    }
    async getBeneficiary(userId) {
        const beneficiary = await beneficiaryUseCase.execute(userId);
        if (!beneficiary)
            throw { status: 404, message: "Beneficiary not found" };
        return beneficiary;
    }
    submit = async (req, res) => {
        try {
            const userId = await this.decodeToken(req);
            await this.getBeneficiary(userId);
            const files = req.files;
            const images = files?.images?.map((f) => f.filename) || [];
            const documents = files?.documents?.map((f) => f.filename) || [];
            const story = new StoryModel_1.default({
                ...req.body,
                beneficiary: userId,
                images,
                documents,
            });
            await story.save();
            app_1.io.emit("new_story_added");
            res.status(201).json(story);
        }
        catch (error) {
            res.status(error.status || 500).json({ message: error.message });
        }
    };
    getByBeneficiary = async (req, res) => {
        try {
            const userId = await this.decodeToken(req);
            await this.getBeneficiary(userId);
            const stories = await StoryModel_1.default.find({ beneficiary: userId }).populate("beneficiary reviewedBy");
            if (!stories.length)
                return res.status(404).json({ message: "No stories available" });
            res.status(200).json(stories);
        }
        catch (error) {
            res.status(error.status || 500).json({ message: error.message });
        }
    };
    getAll = async (_req, res) => {
        try {
            const stories = await StoryModel_1.default.find()
                .populate("beneficiary reviewedBy")
                .sort({ createdAt: -1 });
            if (!stories.length)
                return res.status(404).json({ message: "No stories available" });
            res.status(200).json(stories);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    updateStatus = async (data) => {
        try {
            const { id, status } = data;
            const story = await StoryModel_1.default.findById(id).populate("beneficiary reviewedBy");
            if (!story) {
                throw new Error("Story not found.");
            }
            story.status = status;
            await story.save();
            return story;
        }
        catch (error) {
            console.error("Error updating story status:", error.message);
            throw new Error(error.message || "Failed to update story status.");
        }
    };
    update = async (req, res) => {
        try {
            const { id } = req.params;
            const updatedData = req.body;
            const updatedStory = await StoryModel_1.default.findByIdAndUpdate(id, {
                ...updatedData,
                beneficiary: updatedData.beneficiary._id,
                reviewedBy: updatedData.reviewedBy._id,
            }, { new: true }).populate("beneficiary reviewedBy");
            if (!updatedStory)
                return res.status(404).json({ message: "Story not found" });
            res
                .status(200)
                .json({ message: "Story updated successfully", story: updatedStory });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    reject = async (req, res) => {
        try {
            const story = await StoryModel_1.default.findById(req.params.id).populate("beneficiary reviewedBy");
            if (!story)
                return res.status(404).json({ message: "Story not found" });
            story.status = "rejected";
            story.reviewedAt = new Date();
            await story.save();
            res.status(200).json({ message: "Story rejected" });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    review = async (req, res) => {
        try {
            const userId = await this.decodeToken(req);
            const story = await StoryModel_1.default.findById(req.params.id).populate("beneficiary reviewedBy");
            if (!story)
                return res.status(404).json({ message: "Story not found" });
            story.status = "processing";
            story.reviewedBy = userId;
            story.reviewedAt = new Date();
            await story.save();
            res.status(200).json({ message: "Story reviewed" });
        }
        catch (error) {
            res.status(error.status || 500).json({ message: error.message });
        }
    };
}
exports.StoryUseCase = StoryUseCase;
