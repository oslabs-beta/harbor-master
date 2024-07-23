"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var UserSchema = require('./schemas/userSchema');
var ProjectSchema = require('./schemas/projectSchema');
var VertexSchema = require('./schemas/vertexSchema');
var EdgeSchema = require('./schemas/edgeSchema');
var MONGO_URI = process.env.MONGO_URI;
mongoose_1.default.connect(MONGO_URI, {
    dbName: 'harborMaster'
})
    .then(function () { return console.log('Connected to Harbor Master database.'); })
    .catch(function (err) { return console.log(err); });
var UserModel = mongoose_1.default.model('user', UserSchema);
var ProjectModel = mongoose_1.default.model('project', ProjectSchema);
var VertexModel = mongoose_1.default.model('vertex', VertexSchema);
var EdgeModel = mongoose_1.default.model('edge', EdgeSchema);
module.exports = {
    UserModel: UserModel,
    ProjectModel: ProjectModel,
    VertexModel: VertexModel,
    EdgeModel: EdgeModel
};
