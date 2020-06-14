import showOffer from "./showOffer";

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
    this.cursorPositionInputPosition = null;
  }

  updateForm() {
    this.inputPrice.value = `${this.transformValueForInput(this.price)} рублей`;
    this.inputPrice.selectionStart = this.cursorPositionInputPosition;
    this.inputPrice.selectionEnd = this.cursorPositionInputPosition;
    this.inputInitialFee.value = this.transformValueForInput(this.initialFee);
    this.rangeInitialFee.value = this.initialFeePercantage;
    this.outputInitialFee.value = `${this.initialFeePercantage}%`;
    this.inputTerm.value = this.transformValueForInput(this.term);
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
      this.transformValueForInput(this.creditSum),
      this.transformValueForInput(this.monthlyPayment),
      `${this.transformValueForInput(
        this.interestRate.toFixed(2).replace(/\./, ",")
      )}%`,
      this.transformValueForInput(this.requiredIncome)
    );
  }

  updatePrice(priceValue) {
    if (priceValue) {
      this.price += priceValue;
    } else {
      this.cursorPositionInputPosition = this.inputPrice.selectionStart;
      this.digitsPattern(this.inputPrice);
      this.price = this.stringToNumber(this.inputPrice.value);
    }

    this.checkValidPrice();
    this.calculateMinInitialFee();
    this.updateForm();
  }

  updateInitialFee() {
    this.digitsPattern(this.inputInitialFee);
    this.initialFee = Math.ceil(
      this.stringToNumber(this.inputInitialFee.value)
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
    this.term = this.stringToNumber(termInput.value);

    this.updateForm();
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

  transformValueForInput(number) {
    return number.toString().replace(/(\d)(?=(\d{3})+([^\d]|$))/g, "$1 ");
  }

  digitsPattern(input) {
    input.value = input.value.replace(/[^0-9 ]/, "");
  }

  stringToNumber(str) {
    return +str.replace(/\D/g, "");
  }

  plural(number, one, two, five) {
    if (number % 10 === 1) {
      return one;
    } else {
      return two;
    }
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
    } ${this.minTerm === 1 ? "год" : "лет"}`;
    this.querySelector(
      ".calculator__range-extra-text__max"
    ).textContent = `${this.maxTerm} лет`;
    this.priceLabel = this.querySelector(".calculator__range-extra-text_price");

    this.priceLabel.textContent = `От ${this.transformValueForInput(
      this.minPrice
    )} до ${this.transformValueForInput(this.maxPrice)} рублей`;

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
  }
}
