import * as Yup from "yup";

const emailRegex =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const usernameRegex = /^[a-zA-Z0-9_]{3,50}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|\\:;\"'<>,.?/`~\-])[A-Za-z\d!@#$%^&*()_+={}\[\]|\\:;\"'<>,.?/`~\-]{6,}$/;

const validationSchemas = {
  login: Yup.object().shape({
    username: Yup.string()
      .min(3, "Username must be at least 3 symbols")
      .max(50, "Too long")
      .test({
        name: "is-valid",
        exclusive: true,
        message: "${path} must be a valid username or email",
        test: (value) => {
          return emailRegex.test(value) || usernameRegex.test(value);
        },
      })
      .required("This field is required"),

    password: Yup.string()
      .min(6, "Password must be at least 6 characters long")
      .required("Password is required"),
  }),

  registration: Yup.object().shape({
    username: Yup.string()
      .min(3, "Username must be at least 3 symbols")
      .max(50, "Username must be less than 50 symbols")
      .matches(usernameRegex, "Username can have only letters and numbers")
      .required("Username is required field"),
    email: Yup.string()
      .matches(emailRegex, "Please provide a valide email")
      .required("Email is required field"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters long")
      .matches(
        passwordRegex,
        "Password must include at least one upper letter, lower letter, number, and special character."
      )
      .required("Password is required field"),
    confirmPassword: Yup.string()
      .required("Confirm password is required field")
      .oneOf([Yup.ref("password")], "Password must match"),
  }),

  username: Yup.object().shape({
    username: Yup.string()
      .min(3, "Username must be at least 3 symbols")
      .max(50, "Username must be less than 50 symbols")
      .matches(usernameRegex, "Username can have only letters and numbers")
      .required("Username is required field"),
  }),
};

export default validationSchemas;
