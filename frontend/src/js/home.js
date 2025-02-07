import "../styles/main.scss";
import "../components/header/header";
import "../components/createTweet/createTweet";
import "../components/tweets/tweets";
import "../components/recomendation/recomendation";
import "../components/user/user";
import "../components/recomendation/search";
import "../components/user/editUser";

document.addEventListener("DOMContentLoaded", () => {
  const username = sessionStorage.getItem("username");

  if (!username) {
    window.location.href = "/";
  }
});
