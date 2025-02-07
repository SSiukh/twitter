import ApiService from "../../services/ApiService";
import Render from "../../classes/Render";

const getApi = new ApiService();

const renderData = {
  selector: ".home_main_page_tweets_list",
  apiFunc: getApi.getTweets,
  type: "tweets",
  perPage: 4,
  page: 1,
};

const tweetRend = new Render(renderData);
tweetRend.init();
