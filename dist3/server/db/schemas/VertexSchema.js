"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema;
var VertexSchema = new Schema({
    resourceType: { type: String, required: true },
    position: { type: [Number], required: true },
    // will figure out vertex data as we go
    data: { type: Object, required: true }
});
module.exports = VertexSchema;
