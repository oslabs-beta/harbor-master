import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import ProjectProperties from 'interfaces/ProjectProperties';
import Vertex from 'interfaces/Vertex';
import Edge from 'interfaces/Edge';
import ProjectState from "interfaces/ProjectState";

// state represents current project
const initialState: ProjectState = {
  workingProject: {} as ProjectProperties,
  lastSavedProject: {} as ProjectProperties
};

const graphSlice = createSlice({
  name: 'graph',
  initialState,
  reducers: {
    /* individual state changes do NOT update the db - 
    we'll have save button to batch update db with all graph changes since last save */

    setCurrentProject(state, action: PayloadAction<Project>) {
      // use when loading project from grid view or creating new project from scratch
      // creating new project should add new Project document to the db and immediately retrieve record
      Object.assign(state, action.payload);
    },

    saveChanges(state) {
      state.lastSavedProject = state.workingProject;
    },

    discardWorkingChanges(state) {
      state.workingProject = state.lastSavedProject;
    },
  
    addVertex(state, action: PayloadAction<Vertex>) {
      // creates temporary id for unsaved vertex - this does not get sent to API when saving
      const newVertex = Object.assign(action.payload, { id: `v-${Date.now()}` })
      state.workingProject.vertices.push(newVertex);
    },

    deleteVertexById(state, action: PayloadAction<number>) {
      // requires deleting vertex and any edges attached to it
      state.workingProject.vertices = state.workingProject.vertices.filter(v => v.id !== action.payload)
      state.workingProject.edges = state.workingProject.edges.filter(e => !e.endpointVertexIds.includes(action.payload));
    },

    modifyVertex(state, action: PayloadAction<Vertex>) {
      // can be used for modifying data, changing resource type, or repositioning
      // send payload representing new vertex data
      state.workingProject.vertices.forEach(v => {
        if (v.id === action.payload.id) {
          Object.assign(v, action.payload);
        }
      })
    },

    addEdge(state, action: PayloadAction<Edge>) {
      // creates temporary id for unsaved edge - this does not get sent to API when saving
      const newEdge = Object.assign(action.payload, { id: `e-${Date.now()}` })
      state.workingProject.edges.push(newEdge);
    },

    deleteEdgeById(state, action: PayloadAction<number>) {
      state.workingProject.edges = state.workingProject.edges.filter(e => e.id !== action.payload);
    },

    modifyEdgeEndpoints(state, action: PayloadAction<Edge>) {
      // send payload representing new edge data - id and desired endpoint vertices
      state.workingProject.edges.forEach(e => {
        if (e.id === action.payload.id) e.endpointVertexIds = action.payload.endpointVertexIds;
      });
    }
  }
});

export const { actions, reducer } = graphSlice;
export const { addVertex, deleteVertexById, addEdge } = actions;
export default reducer;