import ApiService from "../../services/ApiService";

const searchApi = new ApiService();
const searchField = document.querySelector(
  ".home_main_side_search_field_input"
);
const searchResults = document.querySelector(".home_main_side_search_results");
const searchMessage = document.querySelector(
  ".home_main_side_search_results_mes"
);

const renderResults = (data) => {
  const html = data
    .map(({ id, username }) => {
      return `
    <li data-id="${id}" class="home_main_side_search_results_item">
      <a class="home_main_side_search_results_item_link" href="/home/${id}">
        <img
              src="../assets/user.PNG"
              alt=""
              class="home_main_side_search_results_item_link_img"
          />
          <p class="home_main_side_search_results_item_link_username">${username}</p>
      </a>
    </li>
      `;
    })
    .join("");

  searchResults.innerHTML = html;
};

const handleSearch = async (e) => {
  const response = await searchApi.getAllUsers();

  if (!response.result) {
    return;
  }

  const currentValue = e.target.value.trim().toLowerCase();

  const filteredData = response.data.filter(
    ({ username }) =>
      currentValue && username.trim().toLowerCase().includes(currentValue)
  );

  renderResults(filteredData);
};

searchField.addEventListener("focus", () => {
  searchResults.classList.remove("visually-hidden");
});
searchField.addEventListener("blur", (e) => {
  if (!searchResults.contains(e.relatedTarget)) {
    searchResults.classList.add("visually-hidden");
  }
});
searchField.addEventListener("input", (e) => {
  searchMessage.classList.add("visually-hidden");
  handleSearch(e);
});
