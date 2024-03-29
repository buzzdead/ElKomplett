import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit'
import agent from '../../app/api/agent'
import { Basket } from '../../app/models/basket'
import { getCookie } from '../../app/util/util'

interface BasketState {
  basket: Basket | null
  status: string
}

export const fetchBasketAsync = createAsyncThunk<Basket>(
  'basket/fetchBasketAsync',
  async (_, thunkAPI) => {
    try {
      return await agent.Basket.get()
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data })
    }
  },
  {
    condition: () => {
      if (!getCookie('buyerId')) return false
    },
  },
)

export const addBasketItemAsync = createAsyncThunk<
  Basket,
  { productId: number; quantity: number, configId?: number }
>('basket/addBasketItemAsync', async ({ productId, quantity, configId }, thunkAPI) => {
  try {
    return await agent.Basket.addItem(productId, quantity, configId)
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data })
  }
})

export const removeBasketItemAsync = createAsyncThunk<
  void,
  { productId: number; quantity: number; name?: string, configId?: number }
>('basket/removeBasketItemAsync', async ({ productId, quantity, configId }, thunkAPI) => {
  try {
    await agent.Basket.removeItem(productId, quantity, configId)
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data })
  }
})

const initialState: BasketState = {
  basket: null,
  status: 'idle',
}

export const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    setBasket: (state, action) => {
      state.basket = action.payload
    },
    clearBasket: (state) => {
      state.basket = null
    }
  },
  extraReducers: (builder) => {
    builder.addCase(addBasketItemAsync.pending, (state, action) => {
      const stat = action.meta.arg.configId ? 'pendingAddItem' + action.meta.arg.productId + '-' + action.meta.arg.configId : 'pendingAddItem' + action.meta.arg.productId
      state.status = stat
    })
    builder.addCase(removeBasketItemAsync.pending, (state, action) => {
      state.status = 'pendingRemoveItem' + action.meta.arg.productId + action.meta.arg.name
    })
    builder.addCase(removeBasketItemAsync.fulfilled, (state, action) => {
      const { productId, quantity, configId } = action.meta.arg

      var itemIndex = state.basket?.items.findIndex((i) => i.productId === productId && i.configId === configId)
      
      if (itemIndex === -1 || itemIndex === undefined) return
      state.basket!.items[itemIndex].quantity -= quantity
      if (state.basket?.items[itemIndex].quantity === 0) state.basket.items.splice(itemIndex, 1)
      state.status = 'idle'
    })
    builder.addCase(removeBasketItemAsync.rejected, (state, action) => {
      state.status = 'idle'
    })
    builder.addMatcher(isAnyOf(addBasketItemAsync.fulfilled, fetchBasketAsync.fulfilled), (state, action) => {
        state.basket = action.payload
        state.status = 'idle'
      })
      builder.addMatcher(isAnyOf(addBasketItemAsync.rejected, fetchBasketAsync.rejected), (state, action) => {
        console.log(action.payload)
        state.status = 'idle'
      })
  },
})

export const { setBasket, clearBasket } = basketSlice.actions
