import Render from "../../classes/Render";
import ApiService from "../../services/ApiService";
import EditTweet from "../../classes/EditTweet";
import Modal from "../../classes/Modal";

const list = document.querySelector(".home_main_side_profiles_list");
const homePage = document.querySelector(".home_main_page");
const getUserApi = new ApiService();

const render = ({ username, email, created_at }, id) => {
  const userId = sessionStorage.getItem("id");
  const markup = `<div class="profile">
        <div class="profile_header">
            <button class="profile_header_button">
                <svg width="20" height="20" class="profile_header_button_icon">
                    <use href="../assets/icons.svg#open"></use>
                </svg>
            </button>
            
            <div class="profile_header_info">
            <p class="profile_header_info_username">${username}</p>
            <p class="profile_header_info_posts-qty"></p>
            </div>
        </div>
        <div class="profile_scroll">
            <div class="profile_scroll_main">
                <div class="profile_scroll_main_info">
                    <img src="../assets/user.PNG" alt="user photo" class="profile_scroll_main_info_img" />
                    <div class="profile_scroll_main_info_block">
                        <p class="profile_scroll_main_info_block_username">${username}</p>
                        <p class="profile_scroll_main_info_block_email">${email}</p>
                    </div>
                </div>
                ${
                  userId === id
                    ? '<button class="profile_scroll_main_follow">Edit username</button>'
                    : ""
                }
                
            </div>
            <div class="profile_scroll_info">
                <p class="profile_scroll_info_posts-qty"></p>
                <p class="profile_scroll_info_date">Join date: ${created_at}</p>
            </div>
            <p class="profile_scroll_post-text">Posts</p>
            <ul class="profile_scroll_posts"></ul>
        </div>
    </div>`;

  homePage.innerHTML = markup;
};

const checkUrl = async () => {
  const path = window.location.pathname;

  if (!/^\/home\/\d+$/.test(path)) {
    return;
  }

  const id = path.match(/\d+/)[0] ?? false;

  try {
    const response = await getUserApi.getUser(id);
    render(response.data, id);
  } catch (error) {
    return;
  }

  const editUserTweet = new EditTweet(".edit", ".profile_scroll_posts");
  editUserTweet.init();

  const editUsername = document.querySelector(".profile_scroll_main_follow");
  new Modal(".editUsername", editUsername);

  const backButton = document.querySelector(".profile_header_button");

  backButton.addEventListener("click", () => {
    window.location.href = "/home";
  });

  const renderUsersTweetsData = {
    selector: ".profile_scroll_posts",
    apiFunc: getUserApi.getTweets,
    type: "tweets",
    perPage: 4,
    page: 1,
    id,
  };

  const userTweetsRend = new Render(renderUsersTweetsData);
  const totalTweets = await userTweetsRend.init();

  document.querySelector(
    ".profile_scroll_info_posts-qty"
  ).textContent = `${totalTweets} posts`;

  document.querySelector(
    ".profile_header_info_posts-qty"
  ).textContent = `${totalTweets} posts`;
};

list.addEventListener("click", (e) => {
  const listItem = e.target.closest(".users");

  if (listItem) {
    const userId = listItem.dataset.id;

    const newUrl = `/home/${userId}`;
    history.pushState({ userId: userId }, "", newUrl);

    checkUrl();
  }
});

window.addEventListener("popstate", (e) => {
  if (!e.state) {
    window.location.reload();
    return;
  }

  checkUrl();
});

checkUrl();
