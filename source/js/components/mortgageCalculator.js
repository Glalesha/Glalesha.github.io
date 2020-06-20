import CalculatorElement from "./calculatorElement";

export default class MortgageCalculator extends CalculatorElement {
  constructor() {
    super();
    this.purpose = "mortgage";
    this.minPrice = 1200000;
    this.maxPrice = 25000000;
    this.priceStep = 100000;
    this.minInitialFeePercantage = 10;
    this.maxInitialFeePercantage = 100;
    this.initialFeeStepPercantage = 5;
    this.minCreditSum = 500000;
    this.minTerm = 5;
    this.maxTerm = 30;
    this.maternalCapitalSum = 470000;
    this.useMaternalCapital = false;
  }

  get interestRate() {
    if (this.initialFeePercantage < 15) {
      return 9.4;
    } else {
      return 8.5;
    }
  }

  get decreaseSum() {
    return this.useMaternalCapital ? this.maternalCapitalSum : 0;
  }

  connectedCallback() {
    super.connectedCallback();
    this.querySelector(".calculator__extra-options").append(
      document
        .querySelector(".calculator__template-checkbox_mortgage")
        .content.cloneNode(true)
    );

    this.querySelector(".input-checkbox").addEventListener("change", () => {
      this.useMaternalCapital = event.currentTarget.checked;
      this.updateForm();
    });
  }
}
