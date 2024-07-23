"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addEdge = exports.deleteVertexById = exports.addVertex = exports.reducer = exports.actions = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var emptyProject = {
    id: '',
    userId: '',
    googleCloudId: '',
    createdAt: '',
    googleRegion: '',
    vertices: [],
    edges: []
};
// state represents current project
var initialState = {
    workingProject: emptyProject,
    lastSavedProject: emptyProject
};
var graphSlice = (0, toolkit_1.createSlice)({
    name: 'graph',
    initialState: initialState,
    reducers: {
        /* individual state changes do NOT update the db -
        we'll have save button to batch update db with all graph changes since last save */
        setCurrentProject: function (state, action) {
            // use when loading project from grid view or creating new project from scratch
            // creating new project should add new Project document to the db and immediately retrieve record
            Object.assign(state, action.payload);
        },
        saveChanges: function (state) {
            state.lastSavedProject = state.workingProject;
        },
        discardWorkingChanges: function (state) {
            state.workingProject = state.lastSavedProject;
        },
        addVertex: function (state, action) {
            // creates temporary id for unsaved vertex - this does not get sent to API when saving
            var newVertex = Object.assign(action.payload, { id: "v-".concat(Date.now()) });
            state.workingProject.vertices.push(newVertex);
        },
        deleteVertexById: function (state, action) {
            // requires deleting vertex and any edges attached to it
            state.workingProject.vertices = state.workingProject.vertices.filter(function (v) { return v.id !== action.payload; });
            state.workingProject.edges = state.workingProject.edges.filter(function (e) { return !e.endpointVertexIds.includes(action.payload); });
        },
        modifyVertex: function (state, action) {
            // can be used for modifying data, changing resource type, or repositioning
            // send payload representing new vertex data
            state.workingProject.vertices.forEach(function (v) {
                if (v.id === action.payload.id) {
                    Object.assign(v, action.payload);
                }
            });
        },
        addEdge: function (state, action) {
            // creates temporary id for unsaved edge - this does not get sent to API when saving
            var newEdge = Object.assign(action.payload, { id: "e-".concat(Date.now()) });
            state.workingProject.edges.push(newEdge);
        },
        deleteEdgeById: function (state, action) {
            state.workingProject.edges = state.workingProject.edges.filter(function (e) { return e.id !== action.payload; });
        },
        modifyEdgeEndpointsById: function (state, action) {
            // send payload representing new edge data - id and desired endpoint vertices
            state.workingProject.edges.forEach(function (e) {
                if (e.id === action.payload.id)
                    e.endpointVertexIds = action.payload.endpointVertexIds;
            });
        }
    }
});
exports.actions = graphSlice.actions, exports.reducer = graphSlice.reducer;
exports.addVertex = exports.actions.addVertex, exports.deleteVertexById = exports.actions.deleteVertexById, exports.addEdge = exports.actions.addEdge;
exports.default = exports.reducer;
