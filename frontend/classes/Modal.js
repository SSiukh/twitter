export default class Modal {
  #overlay;
  #closeButton;
  #transitButton;
  #openModal;
  #isOverlay;

  constructor(selector, openModal, isOverlay = true) {
    this.#overlay = document.querySelector(selector);
    this.#closeButton = document.querySelector(`${selector}-close-button`);
    this.#transitButton = document.querySelector(`${selector}-transit-button`);
    this.#openModal = openModal;
    this.#isOverlay = isOverlay;

    this.initEvents();
  }

  open() {
    this.#overlay.classList.remove("visually-hidden");
    document.body.style.overflow = "hidden";
  }

  close() {
    this.#overlay.classList.add("visually-hidden");
    document.body.style.overflow = "";
  }

  transit() {
    this.close();
    const target = this.#transitButton.dataset.target;
    document.querySelector(`.${target}`).classList.remove("visually-hidden");
  }

  initEvents() {
    if (this.#openModal) {
      this.#openModal.addEventListener("click", () => this.open());
    }

    if (this.#overlay) {
      this.#overlay.addEventListener("click", (e) => {
        e.target === this.#overlay && this.close();
      });
    }

    if (!this.#isOverlay) {
      document.addEventListener("click", (e) => {
        if (
          !this.#overlay.contains(e.target) &&
          !this.#openModal.contains(e.target)
        ) {
          this.close();
        }
      });
    }

    if (this.#closeButton) {
      this.#closeButton.addEventListener("click", () => this.close());
    }

    if (this.#transitButton) {
      this.#transitButton.addEventListener("click", () => this.transit());
    }

    document.addEventListener("keydown", (e) => {
      if (
        e.key === "Escape" &&
        !this.#overlay.classList.contains("visually-hidden")
      ) {
        this.close();
      }
    });
  }
}
