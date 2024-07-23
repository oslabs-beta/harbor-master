"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema;
var VertexSchema = require('./VertexSchema');
var EdgeSchema = require('./EdgeSchema');
var ProjectSchema = new Schema({
    userId: { type: String, required: true },
    googleCloudId: { type: String, required: true },
    createdAt: { type: String, required: true },
    googleRegion: { type: String, required: true },
    vertices: { type: [VertexSchema], required: true },
    edges: { type: [EdgeSchema], required: true }
});
// TO-DO: figure out if creating new Project document automatically adds _id field to its new vertices and edges
// if so, need temporary id for each vertex and edge on front end until project saved
// if not, need permanent id generated for each vertex and edge on creation; in this case, add _id field to VertexSchema and EdgeSchema as it won't be auto generated
module.exports = ProjectSchema;
