export default function makeRequest(purpose, price, initialFee, term) {
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
  const userInfoInputs = request.querySelectorAll(".request__input");
  const inputFullname = request.querySelector(".request__input_fullname");
  const inputTelephone = request.querySelector(".request__input_phone-number");
  const inputEmail = request.querySelector(".request__input_email");

  inputFullname.focus();
  userInfoInputs.forEach((item) => {
    item.addEventListener("change", () => checkEmpty(item));
  });
  requestForm.addEventListener("submit", submitForm);

  function checkEmpty(input) {
    input.nextElementSibling;
    if (!input.value.length) {
      input.nextElementSibling.classList.remove("request__label_moved");
    } else {
      input.nextElementSibling.classList.add("request__label_moved");
    }
  }

  if (localStorage.getItem("user-data") === null) {
    localStorage.setItem("user-data", []);
  }

  //slice(-4) добавляет числу лишние нули
  inputRequestNumber.value = `№ ${(
    "0000" +
    (+localStorage.getItem("requestsNumber") + 1)
  ).slice(-4)}`;

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

    inputFullname.value = "";
    inputTelephone.value = "";
    inputEmail.value = "";
  }

  function isFormVaild() {
    if (
      inputFullname.value.length &&
      inputTelephone.value.length &&
      inputEmail.value.length
    ) {
      return true;
    } else {
      return false;
    }
  }

  request.classList.remove("visually-hidden");

  if (purpose === "mortgage") {
    inputPurpose.value = "Ипотека";
    labelPrice.textContent = "Стоимость недвижимости";
  } else if (purpose === "car-credit") {
    inputPurpose.value = "Автокредит";
    labelPrice.textContent = "Стоимость автомобиля";
  } else {
    inputPurpose.value = "Потребительский кредит";
    labelPrice.textContent = "Сумма кредита";
  }

  inputPrice.value = price;
  inputInitialFee.value = initialFee;
  inputTerm.value = term;
}
