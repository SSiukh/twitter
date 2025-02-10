import img from "../assets/user.PNG";

export default class Render {
  #list;
  #apiFunc;
  #type;
  #perPage;
  #page;
  #observer;
  #isLoading;
  #totalPages;
  #id;

  constructor({ selector, apiFunc, type, perPage = 10, page = 1, id }) {
    this.#list = document.querySelector(selector);
    this.#apiFunc = apiFunc;
    this.#type = type;
    this.#perPage = perPage;
    this.#page = page;
    this.#isLoading = false;
    this.#totalPages = null;
    this.#id = id;
  }

  #template(item) {
    switch (this.#type) {
      case "tweets":
        return `<li data-id="${item.id}" class="tweets">
            <div class="tweets_block">
              <a href="/home/${item.user_id}" class="tweets_block_img">
                <img class="tweets_block_img_src" src="${img}" alt="user photo"/>
              </a>
              <div class="tweets_block_main">
                  <div class="tweets_block_main_info">
                      <p class="tweets_block_main_info_username">${
                        item.username
                      }</p>
                      <p class="tweets_block_main_info_date">${
                        item.created_at
                      }</p>
                  </div>
                  <p class="tweets_block_main_text">${item.content}</p>

                  ${
                    item.created_at !== item.updated_at
                      ? `<p class="tweets_block_main_updated">Updated at ${item.updated_at}</p>`
                      : ""
                  }
              </div>
            </div>
            
                ${
                  item.user_id === +sessionStorage.getItem("id")
                    ? `
              <button class="tweets_button">
              <svg width="20" height="20" class="tweets_button_icon">
                    <use href="../assets/icons.svg#edit"></use>
              </svg>
              </button>
                    `
                    : ""
                }
        </li>`;
      case "users":
        return `<li data-id="${item.id}" class="users">
                <div class="users_main">
                    <img class="users_main_photo" src="${img}" alt="user photo" />
                    <div class="users_main_info">
                        <p class="users_main_info_username">${item.username}</p>
                        <p class="users_main_info_email">${item.email}</p>
                    </div>
                </div>
                <button class="users_follow">
                    View
                </button>
            </li>`;
      default:
        return "incorrect type";
    }
  }

  #render(data) {
    const id = sessionStorage.getItem("id");
    const html =
      this.#type === "users"
        ? data
            .filter((item) => item.id !== +id)
            .map((item) => this.#template(item))
            .join("")
        : data.map((item) => this.#template(item)).join("");

    this.#list.insertAdjacentHTML("beforeend", html);
  }

  async #loadMore() {
    if (
      this.#isLoading ||
      (this.#totalPages && this.#page > this.#totalPages)
    ) {
      return;
    }

    this.#isLoading = true;

    try {
      const { result, data, meta } = await this.#apiFunc(
        this.#perPage,
        this.#page,
        this.#id
      );
      if (result) {
        this.#render(data);
        this.#page += 1;
        this.#totalPages = meta?.total_pages || null;
        this.#observeLastElement();
      }
    } catch (error) {
      console.error("Error loading more data:", error);
    } finally {
      this.#isLoading = false;
    }
  }

  #observeLastElement() {
    const lastElement = this.#list.lastElementChild;
    if (lastElement) {
      this.#observer.observe(lastElement);
    }
  }

  async init() {
    try {
      const { result, data, meta } = await this.#apiFunc(
        this.#perPage,
        this.#page,
        this.#id
      );
      if (!result) {
        console.warn("No initial data available.");
        return;
      }

      this.#render(data);
      this.#page += 1;
      this.#totalPages = meta?.total_pages || null;

      this.#observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.#observer.unobserve(entry.target);
            this.#loadMore();
          }
        });
      });

      this.#observeLastElement();

      return meta.total;
    } catch (error) {
      console.error("Initialization error:", error);
    }
  }
}
