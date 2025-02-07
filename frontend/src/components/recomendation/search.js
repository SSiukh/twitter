import ApiService from "../../services/ApiService";

const searchApi = new ApiService();
const searchField = document.querySelector(
  ".home_main_side_search_field_input"
);
const searchResults = document.querySelector(".home_main_side_search_results");
const searchMessage = document.querySelector(
  ".home_main_side_search_results_mes"
);

const onUserClick = (e) => {
  const item = e.target.closest(".home_main_side_search_results_item");
  if (!item) {
    return;
  }

  window.location.replace(`/home/${item.dataset.id}`);
};

const renderResults = (data) => {
  const html = data
    .map(({ id, username }) => {
      return `
    <li data-id="${id}" class="home_main_side_search_results_item">
        <img
            src="../assets/user.PNG"
            alt=""
            class="home_main_side_search_results_item_img"
        />
        <p class="home_main_side_search_results_item_username">${username}</p>
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
searchField.addEventListener("input", (e) => {
  searchMessage.classList.add("visually-hidden");
  handleSearch(e);
});
searchResults.addEventListener("click", (e) => {
  onUserClick(e);
});
