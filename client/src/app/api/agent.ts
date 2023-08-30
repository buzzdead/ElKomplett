import axios, { AxiosError, AxiosResponse } from 'axios'
import { toast } from 'react-toastify'
import { PaginatedResponse } from '../models/pagination'
import { router } from '../router/Routes'
import { store } from '../store/configureStore'

const sleep = () => new Promise((resolve) => setTimeout(resolve, 50))

axios.defaults.baseURL = process.env.REACT_APP_API_URL
axios.defaults.withCredentials = true

const responseBody = (response: AxiosResponse) => response.data

axios.interceptors.request.use((config) => {
  const token = store.getState().account.user?.token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

axios.interceptors.response.use(
  async (response) => {
    if (process.env.NODE_ENV === 'development') await sleep()
    const pagination = response.headers['pagination']
    if (pagination) {
      response.data = new PaginatedResponse(response.data, JSON.parse(pagination))
      return response
    }
    return response
  },
  (error: AxiosError) => {
    const { data, status } = error.response as AxiosResponse
    switch (status) {
      case 400:
        if (data.errors) {
          const modelStateErrors: string[] = []
          for (const key in data.errors) {
            if (data.errors[key]) {
              modelStateErrors.push(data.errors[key])
            }
          }
          throw modelStateErrors.flat()
        }
        toast.error(data.title)
        break
      case 401:
        toast.error(data.title || 'Unauthorised')
        break
      case 403:
        toast.error('You are not allowed to do that!')
        break
      case 405:
        toast.error(data.title)
        break
      case 500:
        router.navigate('/server-error', { state: { error: data } })
        break
      default:
        break
    }
    return Promise.reject(error.response)
  },
)

const requests = {
  get: (url: string, params?: URLSearchParams) => axios.get(url, { params }).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axios.put(url).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
  postForm: (url: string, data: FormData) =>
    axios
      .post(url, data, {
        headers: { 'Content-type': 'multipart/form-data' },
      })
      .then(responseBody),
  putForm: (url: string, data: FormData) =>
    axios
      .put(url, data, {
        headers: { 'Content-type': 'multipart/form-data' },
      })
      .then(responseBody),
}

function createFormData(item: any) {
  let formData = new FormData()
  for (const key in item) {
    formData.append(key, item[key])
  }
  return formData
}

function createFormData2(item: any) {
  let formData = new FormData();

  for (const key in item) {
    if (Array.isArray(item[key])) {
      // If the property is an array, it might be 'files'
      item[key].forEach((file: any, index: number) => {
        formData.append(key, file);
      });
    } else {
      formData.append(key, item[key]);
    }
  }

  return formData;
}

const Admin = {
  createProduct: (product: any) => requests.postForm('products', createFormData2(product)),
  updateProduct: (product: any) => requests.putForm('products', createFormData2(product)),
  deleteProduct: (id: number) => requests.delete(`products/${id}`),
  createConfig: (config: any) => requests.postForm('config', createFormData2(config)),
  updateConfig: (config: any) => requests.putForm('config', createFormData2(config)),
  removeConfig: (id: any) => requests.delete(`config/${id}`), 
  getConfigPresets: () => requests.get('config/getConfigPresets'),
  addConfigPreset: (configPreset: any, productId: number) => requests.post(`config/AddConfigPresetComposition/${productId}`, configPreset),
  createConfigPresetComposition: (configPreset: any) => requests.post(`config/CreateConfigPresetComposition/`, configPreset),
  setDefaultProduct: (defaultProduct: any) => requests.putForm(`products/SetDefaultConfig`, createFormData(defaultProduct)),
  getConfig: (id: any) => requests.get(`config/${id}`),
  sendEmail: (formData: any) => requests.postForm(`buggy`, createFormData(formData)),
  getMessages: () => requests.get('buggy/messages')
}
  

const Catalog = {
  list: (params: URLSearchParams) => requests.get('products', params),
  details: (id: number) => requests.get(`products/${id}`),
  fetchFilters: () => requests.get('products/filters'),
  categories: () => requests.get('category/getCategories'),
  category: (id: number) => requests.get(`category/${id}`),
  editCategory: (id: number, data: any) => requests.putForm(`category/${id}`, createFormData(data)),
  createCategory: (data: any) => requests.postForm(`category`, createFormData(data)),
  deleteCategory: (id: number) => requests.delete(`category/${id}`)
}
const promiseAndCatchError = (path: string) => {
  requests.get(path).catch((error) => console.log(error))
}
const TestErrors = {
  get400Error: () => promiseAndCatchError('buggy/bad-request'),
  get401Error: () => promiseAndCatchError('buggy/unauthorised'),
  get404Error: () => promiseAndCatchError('buggy/not-found'),
  get500Error: () => promiseAndCatchError('buggy/server-error'),
  getValidationerror: () => requests.get('buggy/validation-error'),
}

const productReq = (productId: number, quantity: number, configId?: number) => {
  let str = `basket?productId=${productId}&quantity=${quantity}`
  if (configId) str += `&configId=${configId}`
  return str
}

const Basket = {
  get: () => requests.get('basket'),
  addItem: (productId: number, quantity = 1, configId?: number) =>
    requests.post(productReq(productId, quantity, configId), {}),
  removeItem: (productId: number, quantity = 1, configId?: number) =>
    requests.delete(productReq(productId, quantity, configId)),
}

const Account = {
  login: (values: any) => requests.post('account/login', values),
  register: (values: any) => requests.post('account/register', values),
  currentUser: () => requests.get('account/currentUser'),
  fetchAddress: () => requests.get('account/savedAddress'),
}

const Orders = {
  list: () => requests.get('orders'),
  fetch: (id: number) => requests.get(`/orders/${id}`),
  create: (values: any) => requests.post('orders', values),
}

const Payments = {
  createPaymentIntent: () => requests.post('payments', {}),
}
const agent = {
  Catalog,
  TestErrors,
  Basket,
  Account,
  Orders,
  Payments,
  Admin,
}

export default agent
