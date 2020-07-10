import CalculatorElement from "./calculatorElement";

export default class CarCreditCalculator extends CalculatorElement {
  constructor() {
    super();
    this.purpose = "car-credit";
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
    this.querySelector(".calculator__extra-options").append(
      document
        .querySelector(".calculator-template-checkbox_car-credit")
        .content.cloneNode(true)
    );

    this.querySelector(".input-checkbox_casco").addEventListener(
      "change",
      () => {
        this.casco = event.currentTarget.checked;
        this.updateForm();
      }
    );

    this.querySelector(".input-checkbox_life-insurance").addEventListener(
      "change",
      () => {
        this.lifeInsurance = event.currentTarget.checked;
        this.updateForm();
      }
    );
  }
}
