import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import agent from "app/api/agent";
import { IConfigPresetComposition } from "app/models/config";

interface ConfigState {
    configPresets: IConfigPresetComposition[] | null
    status: string
}

export const fetchConfigPresetCompositionAsync = createAsyncThunk<IConfigPresetComposition[]>(
    'config/fetchConfigPresetCompositionAsync',
    async (_, thunkAPI) => {
      try {
        return await agent.Admin.getConfigPresets()
      } catch (error: any) {
        return thunkAPI.rejectWithValue({ error: error.data })
      }
    },
  )

  const initialState: ConfigState = {
    configPresets: null,
    status: 'idle',
  }

  export const configSlice = createSlice({
    name: 'config',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(fetchConfigPresetCompositionAsync.rejected, (state, action) => {
        console.log(action.payload)
        state.status = 'idle'
      })
      builder.addCase(fetchConfigPresetCompositionAsync.fulfilled, (state, action) => {
        state.configPresets = action.payload
        state.status = 'idle'
      })
    },
  })