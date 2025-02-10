import { Notyf } from "notyf";

const notyf = new Notyf();

export default class Tweet {
  #field;
  #button;

  constructor(selector, handleTweet) {
    this.#button = document.querySelector(`${selector}_button`);
    this.#field = document.querySelector(`${selector}_field`);
    this.handleTweet = handleTweet;

    this.initEvents();
  }

  getUserId() {
    const id = sessionStorage.getItem("id");
    return id ?? false;
  }

  getContent() {
    const text = this.#field.value.trim();

    if (!text) {
      return false;
    }

    return text;
  }

  handleSubmit() {
    const tweetData = {
      id: this.getUserId(),
      text: this.getContent(),
    };

    this.handleTweet(tweetData);

    this.#field.value = "";
  }

  initEvents() {
    this.#button.addEventListener("click", () => {
      this.handleSubmit();
    });

    this.#field.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        this.#button.click();
      }
    });
  }
}
