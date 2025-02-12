import showOffer from "./showOffer";

const ERROR_MESSAGE = `Некорректное значение`;

export default class CalculatorElement extends HTMLElement {
  constructor() {
    super();
    this.price = 0;
    this.initialFee = 0;
    this.initialFeePercantage = 0;
    this.creditSum = 0;
    this.term = 0;
    this.monthlyPayment = 0;
    this.requiredIncome = 0;
    this.requiredIncomCoefficient = 45;
  }

  updateForm() {
    this.inputPrice.value = this.transformValueToString(this.price, [
      "рубль",
      "рубля",
      "рублей",
    ]);

    this.inputInitialFee.value = this.transformValueToString(this.initialFee, [
      "рубль",
      "рубля",
      "рублей",
    ]);

    this.rangeInitialFee.value = this.initialFeePercantage;
    this.outputInitialFee.value = `${this.initialFeePercantage}%`;

    this.inputTerm.value = this.transformValueToString(this.term, [
      "год",
      "года",
      "лет",
    ]);

    this.rangeTerm.value = this.term;

    this.updateOffer();
  }

  updateOffer() {
    this.checkValidPrice();
    this.creditSum = this.price - this.initialFee - this.decreaseSum;

    if (this.creditSum < this.minCreditSum) {
      document.querySelector(".offer").classList.add("visually-hidden");
      document.querySelector(".refuse").classList.remove("visually-hidden");
      return;
    } else {
      document.querySelector(".offer").classList.remove("visually-hidden");
      document.querySelector(".refuse").classList.add("visually-hidden");
    }

    let monthlyInterestRate = this.interestRate / 12 / 100;

    this.monthlyPayment = Math.ceil(
      this.creditSum *
        (monthlyInterestRate +
          monthlyInterestRate /
            ((1 + monthlyInterestRate) ** (this.term * 12) - 1))
    );

    this.requiredIncome = Math.ceil(
      (this.monthlyPayment * 100) / this.requiredIncomCoefficient
    );

    showOffer(
      this.transformValueToString(this.creditSum, ["рубль", "рубля", "рублей"]),
      this.transformValueToString(this.monthlyPayment, [
        "рубль",
        "рубля",
        "рублей",
      ]),
      `${this.transformValueToString(
        this.interestRate.toFixed(2).replace(/\./, ",")
      )}%`,
      this.transformValueToString(this.requiredIncome, [
        "рубль",
        "рубля",
        "рублей",
      ]),
      this.purpose,
      this.minCreditSum
    );

    this.hideRequest();
  }

  hideRequest() {
    this.request.classList.add("visually-hidden");

    this.request
      .querySelectorAll(".request__input_user-data")
      .forEach((input) => {
        input.nextElementSibling.classList.remove("request__label_moved");
      });
  }

  updateRequest() {
    this.requestInputsUserData.forEach((input) => {
      input.value = "";
      input.classList.remove("request__input_invalid");
      input.parentNode.querySelector(
        ".request__invalid-input-message"
      ).textContent = "";
    });

    if (!this.request.classList.contains("visually-hidden")) {
      this.request.querySelector(".request__input_fullname").focus();
    }

    this.inputRequestNumber.value = `№ ${(
      "0000" +
      (+localStorage.getItem("requestsNumber") + 1)
    ).slice(-4)}`;

    if (this.purpose === "mortgage") {
      this.requestInputPurpose.value = "Ипотека";
      this.requestLabelPrice.textContent = "Стоимость недвижимости";
    } else if (this.purpose === "car-credit") {
      this.requestInputPurpose.value = "Автокредит";
      this.requestLabelPrice.textContent = "Стоимость автомобиля";
    } else if (this.purpose === "consumer-credit") {
      this.requestInputPurpose.value = "Потребительский кредит";
      this.requestLabelPrice.textContent = "Сумма кредита";
    }

    this.requestInputPrice.value = this.transformValueToString(this.price, [
      "рубль",
      "рубля",
      "рублей",
    ]);
    (this.requestInputInitialFee.value = this.transformValueToString(
      this.initialFee,
      ["рубль", "рубля", "рублей"]
    )),
      (this.requestInputTerm.value = this.transformValueToString(this.term, [
        "год",
        "лет",
        "лет",
      ]));
  }

  updatePriceOnInput(priceValue) {
    this.digitsPattern(this.inputPrice);
    this.price = this.transformStringToNumber(this.inputPrice.value);

    this.calculateMinInitialFee();
  }

  updatePriceOnStep(stepValue) {
    this.price += stepValue;

    this.checkValidPrice();
    this.calculateMinInitialFee();
    this.updateForm();
  }

  updatePriceOnBlur() {
    this.updatePriceOnInput();
    this.updateForm();
  }

  updateInitialFee() {
    this.digitsPattern(this.inputInitialFee);

    this.initialFee = Math.ceil(
      this.transformStringToNumber(this.inputInitialFee.value)
    );
    this.initialFeePercantage = this.calculateInitialFeePercantage();
  }

  updateInitialFeeOnBlur() {
    this.updateInitialFee();
    this.checkValidInitialFee();
    this.updateForm();
  }

  updateInitialFeePercantage() {
    this.initialFeePercantage = this.rangeInitialFee.value;
    this.initialFee = Math.ceil((this.initialFeePercantage * this.price) / 100);

    this.updateForm();
  }

  updateTerm() {
    this.digitsPattern(this.inputTerm);
    this.term = this.transformStringToNumber(this.inputTerm.value);
  }

  updateTermWithRange() {
    this.digitsPattern(this.rangeTerm);
    this.term = this.transformStringToNumber(this.rangeTerm.value);

    this.updateForm();
  }

  updateTermOnBlur() {
    this.updateTerm();
    this.checkValidTerm();
    this.updateForm();
  }

  checkValidPrice() {
    if (this.price > this.maxPrice || this.price < this.minPrice) {
      this.inputPrice.classList.add("calculator__input_price_invalid");
      document.querySelector(
        ".calculator__invalid-input-message"
      ).textContent = ERROR_MESSAGE;
      document
        .querySelector(".offer__button")
        .classList.add("offer__button_disabled");
    } else {
      this.inputPrice.classList.remove("calculator__input_price_invalid");
      document.querySelector(".calculator__invalid-input-message").textContent =
        "";
      document
        .querySelector(".offer__button")
        .classList.remove("offer__button_disabled");
    }
  }

  checkValidInitialFee() {
    if (this.initialFeePercantage < this.minInitialFeePercantage) {
      this.initialFee = this.price / this.minInitialFeePercantage;
      this.initialFeePercantage = this.minInitialFeePercantage;
      this.updateForm();
    } else if (this.initialFee > this.price) {
      this.initialFee = this.price;
      this.initialFeePercantage = this.maxInitialFeePercantage;
      this.updateForm();
    }
  }

  checkValidTerm() {
    if (this.term > this.maxTerm) {
      this.term = this.maxTerm;
    } else if (this.term < this.minTerm) {
      this.term = this.minTerm;
    }
  }

  calculateMinInitialFee() {
    this.initialFee = Math.ceil(
      (this.price / 100) * this.minInitialFeePercantage
    );
    this.initialFeePercantage = this.calculateInitialFeePercantage();
  }

  calculateInitialFeePercantage() {
    return Math.round((this.initialFee / this.price) * 100);
  }

  transformValueToString(number, units) {
    let unit;
    if (units) {
      unit = ` ${this.plural(number, units)}`;
    } else {
      unit = "";
    }
    return `${this.addSpacesInNumber(number)}${unit}`;
  }

  addSpacesInNumber(number) {
    return number.toString().replace(/(\d)(?=(\d{3})+([^\d]|$))/g, "$1 ");
  }

  digitsPattern(input) {
    input.value = input.value.replace(/[^0-9 ]/, "");
  }

  transformStringToNumber(str) {
    return +str.replace(/\D/g, "");
  }

  hideWords(input) {
    input.value = this.transformStringToNumber(input.value);
  }

  plural(number, units) {
    number = Math.abs(number);
    number %= 100;
    if (number >= 5 && number <= 20) {
      return units[2];
    }
    number %= 10;
    if (number === 1) {
      return units[0];
    }
    if (number >= 2 && number <= 4) {
      return units[1];
    }
    return units[2];
  }

  connectedCallback() {
    this.append(
      document.querySelector(".calculator-template").content.cloneNode(true)
    );

    this.inputPrice = this.querySelector(".calculator__input_price");
    this.inputInitialFee = this.querySelector(".calculator__input_initial-fee");
    this.rangeInitialFee = this.querySelector(
      ".calculator__input-range_initial-fee"
    );
    this.outputInitialFee = this.querySelector(
      ".calculator__range-extra-text_initial-fee-output"
    );
    this.inputTerm = this.querySelector(".calculator__input_term");

    this.rangeTerm = this.querySelector(".calculator__range_term");
    this.querySelector(".calculator__range-extra-text__min").textContent = `${
      this.minTerm
    } ${this.plural(this.minTerm, ["год", "лет", "лет"])}`;
    this.querySelector(".calculator__range-extra-text__max").textContent = `${
      this.maxTerm
    } ${this.plural(this.maxTerm, ["год", "лет", "лет"])}`;

    this.priceLabel = this.querySelector(".calculator__range-extra-text_price");
    this.request = document.querySelector(".request");
    this.inputRequestNumber = this.request.querySelector(
      ".request__input_request-number"
    );
    this.requestInputPurpose = this.request.querySelector(
      ".request__input_purpose"
    );
    this.requestInputPrice = this.request.querySelector(
      ".request__input_price"
    );
    this.requestInputInitialFee = this.request.querySelector(
      ".request__input_initial-fee"
    );
    this.requestInputTerm = this.request.querySelector(".request__input_term");
    this.requestLabelPrice = this.request.querySelector(
      ".request__label_price"
    );
    this.requestInputsUserData = this.request.querySelectorAll(
      ".request__input_user-data"
    );
    const requestInputFullname = this.request.querySelector(
      ".request__input_fullname"
    );
    const requestInputTelephone = this.request.querySelector(
      ".request__input_phone-number"
    );
    const requestInputEmail = this.request.querySelector(
      ".request__input_email"
    );

    this.priceLabel.textContent = `От ${this.transformValueToString(
      this.minPrice
    )} до ${this.transformValueToString(this.maxPrice)} рублей`;

    this.inputPrice.min = this.minPrice;
    this.inputPrice.max = this.maxPrice;
    this.inputPrice.step = this.priceStep;

    this.rangeInitialFee.min = this.minInitialFeePercantage;
    this.rangeInitialFee.max = 100;
    this.rangeInitialFee.step = this.initialFeeStepPercantage;

    this.inputTerm.min = this.minTerm;
    this.inputTerm.max = this.maxTerm;
    this.rangeTerm.min = this.minTerm;
    this.rangeTerm.max = this.maxTerm;

    this.price = this.minPrice;
    this.term = this.minTerm;

    this.calculateMinInitialFee();
    this.updateForm();

    this.inputPrice.addEventListener("focus", () =>
      this.hideWords(this.inputPrice)
    );
    this.inputPrice.addEventListener("blur", () => this.updatePriceOnBlur());
    this.inputPrice.addEventListener("input", () => this.updatePriceOnInput());

    this.inputInitialFee.addEventListener("focus", () =>
      this.hideWords(this.inputInitialFee)
    );
    this.inputInitialFee.addEventListener("blur", () =>
      this.updateInitialFeeOnBlur()
    );
    this.inputInitialFee.addEventListener("input", () =>
      this.updateInitialFee()
    );
    this.inputInitialFee.addEventListener("input", () =>
      this.updateInitialFee()
    );
    this.rangeInitialFee.addEventListener("input", () =>
      this.updateInitialFeePercantage()
    );

    this.inputTerm.addEventListener("focus", () =>
      this.hideWords(this.inputTerm)
    );
    this.inputTerm.addEventListener("blur", () => {
      this.updateTermOnBlur();
    });
    this.inputTerm.addEventListener("input", () =>
      this.updateTerm(this.inputTerm)
    );
    this.rangeTerm.addEventListener("input", () =>
      this.updateTermWithRange(this.rangeTerm)
    );

    this.querySelector(".calculator__step-up").addEventListener("click", () => {
      this.updatePriceOnStep(this.priceStep);
    });

    this.querySelector(".calculator__step-down").addEventListener(
      "click",
      () => {
        this.updatePriceOnStep(-this.priceStep);
      }
    );
    document.querySelector(".offer__button").addEventListener("click", () => {
      this.request.classList.remove("visually-hidden");
      this.updateRequest();
    });
  }
}
