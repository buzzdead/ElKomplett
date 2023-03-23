import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import agent from "app/api/agent";
import { IConfigPresetComposition } from "app/models/config";

interface ConfigState {
    configPresets: IConfigPresetComposition[] | null
    status: string
    configsLoaded: boolean
}

const configAdapter = createEntityAdapter<IConfigPresetComposition>()

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

  export const configSlice = createSlice({
    name: 'config',
    initialState: configAdapter.getInitialState<ConfigState>({
      configPresets: null,
      status: 'idle',
      configsLoaded: false
    }),
    reducers: {
      setConfigPresetComposition: (state, action) => {
        configAdapter.upsertOne(state, action.payload)
        state.configsLoaded = false
    },
    },
    extraReducers: (builder) => {
      builder.addCase(fetchConfigPresetCompositionAsync.rejected, (state, action) => {
        console.log(action.payload)
        state.status = 'idle'
      })
      builder.addCase(fetchConfigPresetCompositionAsync.fulfilled, (state, action) => {
        state.configPresets = action.payload
        state.configsLoaded = true
        state.status = 'idle'
      })
    },
  })

  export const {setConfigPresetComposition} = configSlice.actions