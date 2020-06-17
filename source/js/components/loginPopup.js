import forbidScroll from "./forbidScroll";

export default function loginPopup() {
  const popup = document.querySelector(".login-popup");
  const loginForm = document.querySelector(".form-login");
  const enterButton = document.querySelector(".page-header__button-open");
  const closeButton = document.querySelector(".close-button");
  const showPasswordButton = document.querySelector(".password__show");
  const overlay = document.querySelector(".overlay");
  const login = document.querySelector(".login-input input");
  const password = document.querySelector(".password-input input");

  enterButton.addEventListener("click", showLoginPopup);
  showPasswordButton.addEventListener("mousedown", showPassword);
  loginForm.addEventListener("submit", loginFormSubmit);

  function close() {
    overlay.style.display = "none";
    popup.classList.remove("login-popup_open");

    popup.addEventListener(
      "transitionend",
      () => {
        popup.style.visibility = "hidden";
        login.value = "";
        password.value = "";
      },
      { once: true }
    );
  }

  function closeOnEsc() {
    if (event.key === "Escape") {
      close();
    }
  }

  function showLoginPopup() {
    forbidScroll(enterButton, closeButton);

    popup.style.visibility = "visible";
    popup.classList.add("login-popup_open");
    login.focus();

    overlay.style.height = `${Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    )}px`;
    overlay.style.display = "block";
    overlay.onclick = function () {
      close();
    };

    popup.addEventListener("keydown", closeOnEsc);
    closeButton.addEventListener("click", close, { once: true });
  }

  function showPassword() {
    this.addEventListener("pointerup", hidePassword, { once: true });
    this.addEventListener("pointerleave", hidePassword, { once: true });
    this.addEventListener("touchend", hidePassword, { once: true });
    this.classList.add("password__show_hold");

    function hidePassword() {
      password.setAttribute("type", "password");
      this.classList.remove("password__show_hold");
    }

    password.setAttribute("type", "text");
  }

  function loginFormSubmit() {
    event.preventDefault();
    localStorage.setItem("login", login.value);
    localStorage.setItem("password", password.value);
    login.value = "";
    password.value = "";
  }
}
