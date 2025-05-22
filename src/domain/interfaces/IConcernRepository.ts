import { ConcernEntity } from "../entities/ConcernEntity";

export interface IConcernRepository {
    createConcern(reporterId: string, reportedMemberId: string, subject: string, description: string): Promise<ConcernEntity>;
    getAllConcerns(): Promise<ConcernEntity[]>;
    getConcernById(id: string): Promise<ConcernEntity | null>;
    updateConcernStatus(id: string, status: 'Pending' | 'In Review' | 'Resolved' | 'Rejected', resolutionNote?: string): Promise<ConcernEntity | null>;
    deleteConcern(id: string): Promise<boolean>;
}