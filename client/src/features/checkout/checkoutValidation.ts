import * as yup from 'yup'

export const validationSchema = [
    
  yup.object({
    fullName: yup.string().required('Full name is required'),
    address1: yup.string().required('Adress line 1 is required'),
    address2: yup.string().required(),
    city: yup.string().required(),
    state: yup.string().required(),
    zip: yup.string().required(),
    country: yup.string().required(),
  }),

  yup.object(),

  yup.object({
    nameOnCard: yup.string().required(),
  }),
  yup.object({
    password: yup.string()
      .required('Password is required')
      .matches(
        /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      ),
    passwordConfirm: yup.string()
      .required('Confirm Password is required')
      .oneOf([yup.ref('password')], 'Passwords must match')
      .nullable()
  }),
  yup.object({
  userName: yup.string()
    .required('Username is required')
    .min(2, 'Username is too short - should be 2 chars minimum.')
    .max(50, 'Username is too long - should be 50 chars maximum.'),
  email: yup.string()
    .required('Email is required')
    .email('Invalid email address')
    .max(50, 'Email is too long - should be 50 chars maximum.'),
  }),
]
