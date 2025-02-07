import ApiService from "../../services/ApiService";
import validationSchemas from "../../services/validation";
import { Notyf } from "notyf";

const updateUsernameApi = new ApiService();
const updateUserNotyf = new Notyf();
const updateUsername = document.querySelector(".editUsername-update-button");
const updateUsernameInput = document.querySelector(".editUsername-text-field");
const updateUsernameModal = document.querySelector(".editUsername");

const handleUpdateUsername = async () => {
  const id = sessionStorage.getItem("id");
  const value = updateUsernameInput.value;

  try {
    await validationSchemas.username.validate({ username: value });
  } catch (error) {
    updateUserNotyf.error({
      message: error.message,
      position: { x: "right", y: "top" },
    });
    return;
  }

  const response = await updateUsernameApi.editUsername(id, value);

  if (!response.result) {
    updateUserNotyf.error({
      message: response.message,
      position: { x: "right", y: "top" },
    });
    return;
  }

  sessionStorage.setItem("username", value);
  updateUsernameModal.classList.add("visually-hidden");
  window.location.reload();
};

updateUsername.addEventListener("click", handleUpdateUsername);
