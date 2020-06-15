import showOffer from "./showOffer";
import makeRequest from "./makeRequest";

const ERROR_MESSAGE = `Некорректное значение`;

export default class CalculatorElement extends HTMLElement {
  constructor(defaultPrice, defaultTerm) {
    super();
    this.price = 0;
    this.initialFee = 0;
    this.initialFeePercantage = 0;
    this.creditSum = 0;
    this.term = 0;
    this.monthlyPayment = 0;
    this.requiredIncome = 0;
    this.requiredIncomCoefficient = 45;
    this.cursorPositionInputPrice = null;
  }

  updateForm() {
    this.inputPrice.value = this.transformValueToString(this.price, [
      "рубль",
      "рубля",
      "рублей",
    ]);

    this.inputPrice.selectionStart =
      this.inputPrice.value.length - this.cursorPositionInputPrice;
    this.inputPrice.selectionEnd = this.inputPrice.selectionStart;

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
  }

  updatePrice(priceValue) {
    if (priceValue) {
      this.price += priceValue;
    } else {
      this.saveCursorPosition(this.inputPrice, "cursorPositionInputPrice");

      this.digitsPattern(this.inputPrice);
      this.price = this.transformStringToNumber(this.inputPrice.value);
    }

    this.checkValidPrice();
    this.calculateMinInitialFee();
    this.updateForm();
  }

  updateInitialFee() {
    this.digitsPattern(this.inputInitialFee);
    this.saveCursorPosition(
      this.inputInitialFee,
      "cursorPositionInputInitialFee"
    );
    this.initialFee = Math.ceil(
      this.transformStringToNumber(this.inputInitialFee.value)
    );
    this.initialFeePercantage = this.calculateInitialFeePercantage();

    this.updateForm();
  }

  updateInitialFeePercantage() {
    this.initialFeePercantage = this.rangeInitialFee.value;
    this.initialFee = Math.ceil((this.initialFeePercantage * this.price) / 100);

    this.updateForm();
  }

  updateTerm(termInput) {
    this.digitsPattern(termInput);
    this.saveCursorPosition(this.inputTerm, "cursorPositionInputTerm");
    this.term = this.transformStringToNumber(termInput.value);

    this.updateForm();
  }

  saveCursorPosition(input, cursorName) {
    if (/[0-9]/.test(input.value[input.selectionStart - 1])) {
      this[cursorName] = input.value.length - input.selectionStart;
    } else {
      this[cursorName] = input.value.length - input.selectionStart + 1;
    }
  }

  checkValidPrice() {
    if (this.price > this.maxPrice || this.price < this.minPrice) {
      this.inputPrice.classList.add("calculator__input_price_invalid");
      document.querySelector(
        ".calculator__invalid-input-message"
      ).textContent = ERROR_MESSAGE;
    } else {
      this.inputPrice.classList.remove("calculator__input_price_invalid");
      document.querySelector(".calculator__invalid-input-message").textContent =
        "";
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
      this.updateForm();
    } else if (this.term < this.maxTerm) {
      this.term = this.minTerm;
      this.updateForm();
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
    return `${number
      .toString()
      .replace(/(\d)(?=(\d{3})+([^\d]|$))/g, "$1 ")}${unit}`;
  }

  digitsPattern(input) {
    input.value = input.value.replace(/[^0-9 ]/, "");
  }

  transformStringToNumber(str) {
    return +str.replace(/\D/g, "");
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

    this.inputPrice.addEventListener("input", () => this.updatePrice());
    this.inputInitialFee.addEventListener("input", () =>
      this.updateInitialFee()
    );
    this.inputInitialFee.addEventListener("change", () =>
      this.checkValidInitialFee()
    );
    this.inputInitialFee.addEventListener("input", () =>
      this.updateInitialFee()
    );
    this.rangeInitialFee.addEventListener("input", () =>
      this.updateInitialFeePercantage()
    );
    this.inputTerm.addEventListener("input", () =>
      this.updateTerm(this.inputTerm)
    );
    this.rangeTerm.addEventListener("input", () =>
      this.updateTerm(this.rangeTerm)
    );
    this.inputTerm.addEventListener("change", () => this.checkValidTerm());
    this.querySelector(".calculator__step-up").addEventListener("click", () => {
      this.updatePrice(this.priceStep);
    });
    this.querySelector(".calculator__step-down").addEventListener(
      "click",
      () => {
        this.updatePrice(-this.priceStep);
      }
    );
    document
      .querySelector(".offer__button")
      .addEventListener("click", () =>
        makeRequest(
          this.transformValueToString(this.purpose),
          this.transformValueToString(this.price, ["рубль", "рубля", "рублей"]),
          this.transformValueToString(this.initialFee, [
            "рубль",
            "рубля",
            "рублей",
          ]),
          this.transformValueToString(this.term, ["год", "лет", "лет"])
        )
      );
  }
}
