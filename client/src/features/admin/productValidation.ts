import * as yup from 'yup'

const REQ = "Field is required"

export const validationSchema = (imageRequired?: Boolean) =>
  yup.object({
    name: yup.string().required(REQ),
    brand: yup.string().required(REQ),
    price: yup.number().required("Price must be a number greater than 100").moreThan(100),
    quantityInStock: yup.number().min(0).required("Quantity in stock must be a positive number"),
    description: yup.string().required(REQ),
    
  })

const getRequirement = (fieldVal: string, imageRequired?: boolean) => {
  const stringReq = ['key', 'value', 'productId']

  return stringReq.some((v) => fieldVal.includes(v))
    ? yup.string().required(REQ)
    : fieldVal.includes('quantityInStock') || fieldVal.includes('price')
    ? yup.string().required(REQ)
    : null
  }

export const productConfigurationSchema = (id: number) => {
  const fields = []
  for (let i = 0; i < id; i += 1) {
    fields.push(`file${i}`)
    fields.push(`price${i}`)
    fields.push(`quantityInStock${i}`)
    fields.push(`key${i}`)
    fields.push(`value${i}`)
    fields.push(`productId${i}`)
  }

  return yup.object(
    fields.reduce(
      (accumulator, currentValue) => ({
        ...accumulator,
        [currentValue]: getRequirement(currentValue),
      }),
      {},
    ),
  )
}
