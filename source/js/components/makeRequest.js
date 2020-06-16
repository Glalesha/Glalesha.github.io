import forbidScroll from "./forbidScroll";

export default function makeRequest(purpose, price, initialFee, term) {
  const requestContainer = document.querySelector(".request-container");
  const requestTemplate = document.querySelector(".request-template");
  const request = document.querySelector(".request");
  const requestForm = document.querySelector(".request__form");
  const inputRequestNumber = request.querySelector(
    ".request__input_request-number"
  );
  const inputPurpose = request.querySelector(".request__input_purpose");
  const inputPrice = request.querySelector(".request__input_price");
  const inputInitialFee = request.querySelector(".request__input_initial-fee");
  const inputTerm = request.querySelector(".request__input_term");
  const labelPrice = request.querySelector(".request__label_price");
  const inputsUserData = request.querySelectorAll(".request__input_user-data");
  const inputFullname = request.querySelector(".request__input_fullname");
  const inputTelephone = request.querySelector(".request__input_phone-number");
  const inputEmail = request.querySelector(".request__input_email");
  const popup = document.querySelector(".thanks-popup");
  const closeButton = document.querySelector(".thanks-popup__close");
  const overlay = document.querySelector(".overlay");
  const select = document.querySelector(".calculator__select");
  const selected = select.querySelector(".calculator__selected");
  const selectValue = select.querySelector(".calculator__select-value");
  const optionsWrap = select.querySelector(".calculator__options-wrap");
  const optionsContainer = select.querySelector(".calculator__options");
  const options = select.querySelectorAll(".calculator__option");
  const customCalculatorContainer = document.querySelector(
    ".calculator__custom-calculator-container"
  );
  const offer = document.querySelector(".offer");
  const arrow = document.querySelector(".calculator__arrow");
  const optionsOpenedClass = "calculator__options_opened";
  const noBottomRadiusClass = "calculator__selected_no-bottom-radius";
  const arrowUpsidedown = "calculator__arrow_upside-down";

  initRequest();

  function initRequest() {
    inputsUserData.forEach((input) => {
      input.addEventListener("change", () => {
        checkEmpty(input);
        checkInputValidity(input);
      });
    });
    requestForm.addEventListener("submit", submitForm);

    if (localStorage.getItem("user-data") === null) {
      localStorage.setItem("user-data", []);
    }
  }

  function checkEmpty(input) {
    input.nextElementSibling;
    if (!input.value.length) {
      input.nextElementSibling.classList.remove("request__label_moved");
    } else {
      input.nextElementSibling.classList.add("request__label_moved");
    }
  }

  function checkInputValidity(input) {
    if (input.value) {
      input.classList.remove("request__input_invalid");
      input.parentNode.querySelector(
        ".request__invalid-input-message"
      ).textContent = "";
    }

    if (
      input.classList.contains("request__input_phone-number") &&
      !/\W/.test(input.value)
    ) {
      input.classList.remove("request__input_invalid");
      input.parentNode.querySelector(
        ".request__invalid-input-message"
      ).textContent = "";
    }
  }

  function submitForm() {
    event.preventDefault();

    if (!isFormVaild()) {
      request.classList.add("request_invalid");

      request.addEventListener("animationend", removeAnimation);

      function removeAnimation() {
        request.classList.remove("request_invalid");
        request.removeEventListener("animationend", removeAnimation);
      }
      return;
    }

    localStorage.setItem(
      "requestsNumber",
      +localStorage.getItem("requestsNumber") + 1
    );

    localStorage.getItem("user-data");

    localStorage.setItem("user-data", [
      //...localStorage.getItem("user-data"),
      {
        fullName: inputFullname.value,
        telephone: inputTelephone.value,
        email: inputEmail.value,
        number: +localStorage.getItem("requestsNumber") + 1,
      },
    ]);

    openPopup();
    forbidScroll(null, closeButton);

    inputFullname.value = "";
    inputTelephone.value = "";
    inputEmail.value = "";
  }

  function isFormVaild() {
    let errorCount = Array.from(inputsUserData).reduce((errorCount, item) => {
      if (!item.value) {
        item.classList.add("request__input_invalid");
        item.parentNode.querySelector(
          ".request__invalid-input-message"
        ).textContent = "Требуется ввести значение";
        errorCount++;
      } else if (
        item.classList.contains("request__input_phone-number") &&
        /\D/.test(item.value)
      ) {
        item.classList.add("request__input_invalid");
        item.parentNode.querySelector(
          ".request__invalid-input-message"
        ).textContent = "В номере телефона могут быть только цифры";
        errorCount++;
      }

      return errorCount;
    }, 0);

    if (!errorCount) {
      return true;
    } else {
      return false;
    }
  }

  function close() {
    overlay.style.display = "none";
    popup.classList.remove("login-popup_open");
    popup.classList.add("visually-hidden");

    selectValue.textContent = "Выберите цель кредита";
    select.querySelector(".calculator__option_selected") &&
      select
        .querySelector(".calculator__option_selected")
        .classList.remove("calculator__option_selected");
    arrow.classList.remove(arrowUpsidedown);

    customCalculatorContainer.firstElementChild &&
      customCalculatorContainer.firstElementChild.remove();

    request.classList.add("visually-hidden");
    offer.classList.add("visually-hidden");
  }

  function closeOnEsc() {
    if (event.key === "Escape") {
      close();
    }
  }

  function openPopup() {
    popup.classList.remove("visually-hidden");
    popup.classList.add("request-popup_open");
    closeButton.addEventListener(
      "click",
      () => {
        close();
      },
      { once: true }
    );

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
}
