import CalculatorElement from "./calculatorElement";

export default class CarCreditCalculator extends CalculatorElement {
  constructor() {
    super();
    this.minPrice = 500000;
    this.maxPrice = 5000000;
    this.priceStep = 50000;
    this.minInitialFeePercantage = 20;
    this.maxInitialFeePercantage = 100;
    this.initialFeeStepPercantage = 5;
    this.minCreditSum = 200000;
    this.minTerm = 1;
    this.maxTerm = 5;
    this.casco = false;
    this.lifeInsurance = false;
  }

  get interestRate() {
    if (this.casco && this.lifeInsurance) {
      return 3.5;
    } else if (this.casco || this.lifeInsurance) {
      return 8.5;
    } else if (this.price >= 2000000) {
      return 15;
    } else {
      return 16;
    }
  }

  get decreaseSum() {
    return 0;
  }

  connectedCallback() {
    super.connectedCallback();
    this.append(
      document.querySelector(".car-credit-checkbox").content.cloneNode(true)
    );

    this.querySelector(".calculator__input-checkbox_casco").addEventListener(
      "change",
      () => {
        this.casco = event.currentTarget.checked;
        this.updateForm();
      }
    );

    this.querySelector(
      ".calculator__input-checkbox_life-insurance"
    ).addEventListener("change", () => {
      this.lifeInsurance = event.currentTarget.checked;
      this.updateForm();
    });

    document.querySelector(
      ".refuse__title"
    ).textContent = `Наш банк не выдаёт автокредиты меньше ${this.minCreditSum} рублей.`;
    document.querySelector(".calculator__label_price").textContent =
      "Стоимость автомобиля";
    document.querySelector(".terms__label_credit-sum").textContent =
      "Сумму автокредита";
  }
}
