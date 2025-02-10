import Modal from "../../classes/Modal";

const windowWidth = document.documentElement.clientWidth;
const headerModal = document.querySelector(".modal-header");
const recModal = document.querySelector(".home-side");

const checkWidth = (width) => {
  headerModal.classList.toggle("visually-hidden", width < 768);
  recModal.classList.toggle("visually-hidden", width < 1123);
};

checkWidth(windowWidth);

window.addEventListener("resize", () => {
  const dynWindowWidth = document.documentElement.clientWidth;
  checkWidth(dynWindowWidth);
});

const headerOpen = document.querySelector(".home_main_page_title_burger");
const sideOpen = document.querySelector(".home_main_page_title_search");

new Modal(".modal-header", headerOpen);
new Modal(".home-side", sideOpen);
