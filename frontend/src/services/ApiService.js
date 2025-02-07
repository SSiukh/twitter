import axios from "axios";

export default class ApiService {
  constructor() {
    axios.defaults.baseURL = "http://twitter.local/backend";
  }

  async login(login, password) {
    try {
      const response = await axios.post(
        "/login",
        {
          login,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  async register(username, email, password) {
    try {
      const response = await axios.post(
        "/register",
        {
          username,
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  async createTweet(data) {
    if (!data.id || !data.text) {
      return {
        result: false,
        message: "User ID or tweet content is missing",
      };
    }

    try {
      const response = await axios.post("/ctweet", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  async getTweets(per_page = 10, page = 1, id = null) {
    if (typeof per_page !== "number" || typeof page !== "number") {
      return { result: false, message: "Params is not number" };
    }
    const param = {
      per_page,
      page,
    };

    if (id) {
      param.id = id;
    }
    try {
      const response = await axios.get("/gettweets", {
        params: param,
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      } else {
        return {
          result: false,
          message: "Network error or no response from server",
        };
      }
    }
  }

  async getUsers(per_page = 10, page = 1) {
    if (typeof per_page !== "number" || typeof page !== "number") {
      return { result: false, message: "Params is not number" };
    }
    try {
      const response = await axios.get("/getusers", {
        params: {
          per_page,
          page,
        },
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      } else {
        return {
          result: false,
          message: "Network error or no response from server",
        };
      }
    }
  }

  async getUser(id) {
    try {
      const response = await axios.get("/getuser", {
        params: {
          id,
        },
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      } else {
        return {
          result: false,
          message: "Network error or no response from server",
        };
      }
    }
  }
}
