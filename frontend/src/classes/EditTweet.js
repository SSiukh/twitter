import Modal from "./Modal";
import ApiService from "../services/ApiService";

export default class EditTweet {
  #tweetId = null;
  #tweetsList;
  #modalUpdate;
  #modalTextArea;
  #modal;
  #api;

  constructor(modalSelector, listSelector) {
    this.modalSelector = modalSelector;
    this.#modal = document.querySelector(modalSelector);
    this.#modalUpdate = document.querySelector(
      `${modalSelector}-update-button`
    );
    this.#modalTextArea = document.querySelector(`${modalSelector}-text-field`);
    this.#tweetsList = document.querySelector(listSelector);
    this.#api = new ApiService();
  }

  #openModal(e) {
    if (!e.target.closest(".tweets_button")) {
      return;
    }
    console.log("wori");

    const tweet = e.target.closest(".tweets");
    const modal = new Modal(
      this.modalSelector,
      e.target.closest(".tweets_button")
    );
    this.#modalTextArea.value =
      tweet.querySelector(".tweets_main_text").textContent;

    modal.open();
    this.#tweetId = tweet.dataset.id;
  }

  async #update() {
    this.#modal.classList.add("visually-hidden");

    try {
      const response = await this.#api.editTweet(
        this.#tweetId,
        this.#modalTextArea.value
      );
      window.location.reload();
      return response;
    } catch (error) {
      return {
        result: false,
        message: "Something went wrong. Please try again later.",
      };
    }
  }

  init() {
    this.#tweetsList.addEventListener("click", (e) => {
      this.#openModal(e);
    });
    this.#modalUpdate.addEventListener("click", () => {
      this.#update();
    });
  }
}
