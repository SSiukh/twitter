import axios from "axios";

export default class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: "http://twitter.local/backend",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async request(method, url, data = {}, params = {}) {
    try {
      const response = await this.api({
        method,
        url,
        data,
        params,
      });
      return response.data;
    } catch (error) {
      return this.errorHandler(error);
    }
  }

  login = async (login, password) => {
    return await this.request("post", "/login", { login, password });
  };

  register = async (username, email, password) => {
    return await this.request("post", "/register", {
      username,
      email,
      password,
    });
  };

  createTweet = async (data) => {
    if (!data.id || !data.text) {
      return {
        result: false,
        message: "Tweet content is missing",
      };
    }
    return await this.request("post", "/ctweet", data);
  };

  getTweets = async (per_page = 10, page = 1, id = null) => {
    const params = { per_page, page, ...(id && { id }) };
    return await this.request("get", "/gettweets", {}, params);
  };

  getUsers = async (per_page = 10, page = 1) => {
    return await this.request("get", "/getusers", {}, { per_page, page });
  };

  getUser = async (id) => {
    return await this.request("get", "/getuser", {}, { id });
  };

  editTweet = async (id, text) => {
    return await this.request("put", "/edittweet", { id, text });
  };

  getAllUsers = async () => {
    return await this.request("get", "/get_all_users");
  };

  editUsername = async (id, value) => {
    return await this.request("put", "/editusername", { id, value });
  };

  errorHandler(error) {
    if (error.response) {
      return error.response.data;
    } else {
      return {
        result: false,
        message: "Something went wrong, please try again later",
      };
    }
  }
}
