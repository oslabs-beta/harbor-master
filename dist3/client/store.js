"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var graphReducer_1 = __importDefault(require("./reducers/graphReducer"));
exports.store = (0, toolkit_1.configureStore)({
    reducer: {
        graph: graphReducer_1.default
    }
});
