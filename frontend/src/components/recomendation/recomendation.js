import Render from "../../classes/Render";
import ApiService from "../../services/ApiService";

const getUsersApi = new ApiService();

const renderUsersData = {
  selector: ".home_main_side_profiles_list",
  apiFunc: getUsersApi.getUsers,
  type: "users",
  perPage: 4,
  page: 1,
};

const usersRend = new Render(renderUsersData);
usersRend.init();
