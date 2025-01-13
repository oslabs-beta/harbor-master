import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  _id:number | null;
  githubHandle: string | null;
  email: string | null;
  __v: number | null;
  projects: string[];
}

const initialState: UserState = {
  _id:null,
  githubHandle: null,
  email:null,
  __v:null,
  projects:[]
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      const {_id,githubHandle,email,__v,projects} = action.payload;
      state._id=_id;
      state.githubHandle= githubHandle;
      state.email = email;
      state.__v = __v;
      state.projects = projects
    },
    clearUser: (state) => {
      state._id = null;
      state.githubHandle = null;
      state.email = null;
      state.__v = null;
      state.projects = [];
    },
    addProject: (state, action: PayloadAction<string>) => {
      state.projects.push(action.payload); 
    },
    delProject:(state, action: PayloadAction<string>)=>{
      state.projects = state.projects.filter(id => id !== action.payload);
    }
  },
});

export const { setUser, clearUser,addProject,delProject } = userSlice.actions;
export default userSlice.reducer;