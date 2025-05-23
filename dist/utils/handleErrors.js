"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleErrors = void 0;
const handleErrors = (error) => {
    if (error.code === 11000) {
        return "Duplicate field value entered";
    }
    return error.message || "An unknown error occurred";
};
exports.handleErrors = handleErrors;
