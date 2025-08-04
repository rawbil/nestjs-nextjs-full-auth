import * as yup from "yup";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

//register schema
export const registerSchema = yup.object().shape({
  username: yup
    .string()
    .min(3, "Username should be at least 3 characters long")
    .required("username field is required")
    .trim(),
  email: yup
    .string()
    .required("email field is required")
    .trim()
    .matches(emailRegex, "invalid email format"),
  password: yup
    .string()
    .trim()
    .min(8, "password should be at least 8 characters long")
    .matches(
      passwordRegex,
      "password should have at least 1 uppercase letter, 1 lowercase letter and 1 special character"
    ),
  confirm_password: yup
    .string()
    .required("confirm password field is required")
    .oneOf([yup.ref("password")], "passwords should match"),
});

//login schema
export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required("email field is required")
    .trim()
    .matches(emailRegex, "invalid email format"),
  password: yup
    .string()
    .trim()
    .min(8, "password should be at least 8 characters long")
    .matches(
      passwordRegex,
      "password should have at least 1 uppercase letter, 1 lowercase letter and 1 special character"
    ),
});
