import "../styles/main.scss";
import "../components/header/header";
import "../components/createTweet/createTweet";
import "../components/tweets/tweets";
import "../components/recomendation/recomendation";
import "../components/user/user";

document.addEventListener("DOMContentLoaded", () => {
  const username = sessionStorage.getItem("username");

  if (!username) {
    window.location.href = "/";
  }
});
