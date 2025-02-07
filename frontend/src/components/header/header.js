import Modal from "../../classes/Modal";
import validationSchemas from "../../services/validation";
import ApiService from "../../services/ApiService";

const createTweetButton = document.querySelector(".home_header_main_button");
const profileButton = document.querySelector(".home_header_profile");

new Modal(".tweet", createTweetButton);
new Modal(".profile", profileButton, false);

document.querySelector(".home_header_profile_main_username").textContent =
  sessionStorage.getItem("username");

const myProfile = document.querySelector(
  '.home_header_main_nav_list_item_link[data-type="profile"]'
);
const createTweetProfile = document.querySelector(
  ".home_main_page_createTweet_main_user"
);
const userId = sessionStorage.getItem("id");

myProfile.setAttribute("href", `/home/${userId}`);
createTweetProfile.setAttribute("href", `/home/${userId}`);
