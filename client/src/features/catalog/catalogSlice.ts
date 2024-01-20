import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { MetaData } from "../../app/models/pagination";
import { IProduct, ProductParams } from "../../app/models/product";
import { RootState } from "../../app/store/configureStore";

interface CatalogState {
    productsLoaded: boolean
    filtersLoaded: boolean
    status: string
    producers: string[]
    productTypes: string[]
    productParams: ProductParams
    metaData: MetaData | null
}

const PARAMS = {
    PAGE_NUMBER: 'pageNumber',
    PAGE_SIZE: 'pageSize',
    ORDER_BY: 'orderBy',
    SEARCH_TERM: 'searchTerm',
    CATEGORY_ID: 'categoryId',
    PRODUCERS: 'producers',
    PRODUCT_TYPES: 'productTypes',
  };

const productsAdapter = createEntityAdapter<IProduct>()

function getAxiosParams(productParams: ProductParams) {
    const params = new URLSearchParams()
    const appendParam = (key: string, value: any) => {
        if (value) {
          params.append(key, value.toString());
        }
      };
    
      appendParam(PARAMS.PAGE_NUMBER, productParams.pageNumber);
      appendParam(PARAMS.PAGE_SIZE, productParams.pageSize);
      appendParam(PARAMS.ORDER_BY, productParams.orderBy);
      appendParam(PARAMS.SEARCH_TERM, productParams.searchTerm);
      appendParam(PARAMS.CATEGORY_ID, productParams.categoryId);
      appendParam(PARAMS.PRODUCERS, productParams.producers);
      appendParam(PARAMS.PRODUCT_TYPES, productParams.productTypes);
    return params
    
}

export const fetchProductsAsync = createAsyncThunk<IProduct[], void, {state: RootState}>(
    'catalog/fetchProductsAsync',
    async (_, thunkAPI) => {
        const params = getAxiosParams(thunkAPI.getState().catalog.productParams)
        try{
            const response = await agent.Catalog.list(params)
            thunkAPI.dispatch(setMetaData(response.metaData))
            return response.items
        }
        catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const fetchProductAsync = createAsyncThunk<IProduct, number>(
    'catalog/fetchProductAsync',
    async (productId, thunkAPI) => {
        try{
            return await agent.Catalog.details(productId)
        }
        catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const fetchFilters = createAsyncThunk(
    'catalog/fetchFilters',
    async (id: number, thunkAPI) => {
        try {
            return agent.Catalog.fetchFilters(id)
        }
        catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

function initParams() {
    return {
        pageNumber: 1,
        pageSize: 12,
        categoryId: 0,
        orderBy: 'name',
        producers: [],
        productTypes: []
    }
}

export const catalogSlice = createSlice({
    name: 'catalog',
    initialState: productsAdapter.getInitialState<CatalogState>({
        productsLoaded: false,
        filtersLoaded: false,
        status: 'idle',
        producers: [],
        productTypes: [],
        productParams: initParams(),
        metaData: null
    }),
    reducers: {
        setProductParams: (state, action) => {
            state.productParams = {...state.productParams, ...action.payload, pageNumber: 1}
            state.productsLoaded = false
        },
        setPageNumber: (state, action) => {
            state.productsLoaded = false
            state.productParams = {...state.productParams, ...action.payload}
        },
        resetProductParams: (state) => {
            state.productParams = initParams()
        },
        setMetaData: (state, action) => {
            state.metaData = action.payload
        },
        setProduct: (state, action) => {
            productsAdapter.upsertOne(state, action.payload)
            state.productsLoaded = false
        },
        removeProduct: (state, action) => {
            productsAdapter.removeOne(state, action.payload)
            state.productsLoaded = false
        }
     },
    extraReducers: (builder => {
        builder.addCase(fetchProductsAsync.pending, (state) => {
            state.status = 'pendingFetchProducts'
        })
        builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
            productsAdapter.setAll(state, action.payload)
            state.status = 'idle'
            state.productsLoaded = true
        })
        builder.addCase(fetchProductsAsync.rejected, (state, action) => {
            console.log(action.payload)
            state.status = 'idle'
        })
        builder.addCase(fetchProductAsync.pending, (state) => {
            state.status = 'pendingFetchProduct'
        })
        builder.addCase(fetchProductAsync.fulfilled, (state, action) => {
            productsAdapter.upsertOne(state, action.payload)
            state.status = 'idle'
        })
        builder.addCase(fetchProductAsync.rejected, (state, action) => {
            console.log(action)
            state.status = 'idle'
        })
        builder.addCase(fetchFilters.pending, (state) => {
            state.status = 'pendingFetchFilters'
        })
        builder.addCase(fetchFilters.fulfilled, (state, action) => {
            state.producers = action.payload.producers?.map((e: { name: any; }) => e.name)
            state.productTypes = action.payload.productTypes?.map((e: { name: any; }) => e.name)
            state.filtersLoaded = true
        })
        builder.addCase(fetchFilters.rejected, (state, action) => {
            state.status = 'idle'
            console.log(action.payload)
        })
    })
})

export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.catalog)
export const {setProductParams, resetProductParams, setMetaData, setPageNumber, setProduct, removeProduct} = catalogSlice.actions