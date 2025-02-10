import Modal from "../../classes/Modal";
import validationSchemas from "../../services/validation";
import ApiService from "../../services/ApiService";
import { Notyf } from "notyf";

const notyf = new Notyf();

const signInButton = document.querySelector(".auth-main_content_buttons_login");
const signUpButton = document.querySelector(
  ".auth-main_content_buttons_signup"
);

new Modal(".login", signInButton);
new Modal(".signup", signUpButton);

const loginForm = document.querySelector(".login-container_content_form");
const signupForm = document.querySelector(".signup-container_content_form");
const setApi = new ApiService();

const handleResponse = ({ result, message, id }, username) => {
  if (!result) {
    notyf.error({
      message: message,
      position: { x: "right", y: "top" },
    });
    return;
  }

  sessionStorage.setItem("id", id);
  sessionStorage.setItem("username", username);
  window.location.replace("/home.html");
};

const handleLoginSubmit = async (e) => {
  e.preventDefault();
  const { username, password } = e.target.elements;

  try {
    document
      .querySelectorAll(".field-err")
      .forEach((el) => (el.textContent = ""));
    await validationSchemas.login.validate(
      {
        username: username.value,
        password: password.value,
      },
      { abortEarly: false }
    );
  } catch (err) {
    const { path, message } = err.inner[0];
    document.querySelector(`.field-err[data-login=${path}]`).textContent =
      message;
    return;
  }

  const response = await setApi.login(username.value, password.value);

  handleResponse(response, username.value);

  e.target.reset();
};

const handleSignupSubmit = async (e) => {
  e.preventDefault();
  const { username, email, password, confirmPassword } = e.target.elements;

  try {
    document
      .querySelectorAll(".field-err")
      .forEach((el) => (el.textContent = ""));
    await validationSchemas.registration.validate(
      {
        username: username.value,
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
      },
      { abortEarly: false }
    );
  } catch (err) {
    const { path, message } = err.inner[0];
    document.querySelector(`.field-err[data-signup=${path}]`).textContent =
      message;
    return;
  }

  const response = await setApi.register(
    username.value,
    email.value,
    password.value
  );

  handleResponse(response, username.value);

  e.target.reset();
};

loginForm.addEventListener("submit", handleLoginSubmit);
signupForm.addEventListener("submit", handleSignupSubmit);
