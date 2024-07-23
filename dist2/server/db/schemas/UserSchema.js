"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema;
var userSchema = new Schema({
    githubHandle: { type: String, required: true },
    email: { type: String, required: true },
    googleIamSecretKey: { type: String, required: true }
});
module.exports = userSchema;
