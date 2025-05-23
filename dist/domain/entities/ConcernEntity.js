"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConcernEntity = void 0;
class ConcernEntity {
    id;
    reporterId;
    reportedMemberId;
    subject;
    description;
    status = "Pending";
    resolutionNote;
    createdAt;
    updatedAt;
    constructor(init) {
        Object.assign(this, init);
    }
}
exports.ConcernEntity = ConcernEntity;
