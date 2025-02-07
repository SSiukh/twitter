import { Notyf } from "notyf";
import Tweet from "../../classes/Tweet";
import ApiService from "../../services/ApiService";
import Modal from "../../classes/Modal";

const notyfTweet = new Notyf();

const setApi = new ApiService();

const handleTweet = async (tweetData) => {
  try {
    const response = await setApi.createTweet(tweetData);
    if (!response.result) {
      notyfTweet.error({
        message: response.message,
        position: { x: "right", y: "top" },
      });
    }

    notyfTweet.success({
      message: response.message,
      position: { x: "right", y: "top" },
    });
  } catch {
    notyfTweet.error({
      message: "Something went wrong, try again.",
      position: { x: "right", y: "top" },
    });
  }
};

new Tweet(".home_main_page_createTweet", (tweetData) => {
  handleTweet(tweetData);
});
new Tweet(".tweet_container_createTweet", (tweetData) => {
  handleTweet(tweetData);
});
