import CalculatorElement from "./calculatorElement";

export default class ConsumerCreditCalculator extends CalculatorElement {
  constructor() {
    super();
    this.purpose = "consumer-credit";
    this.minPrice = 800000;
    this.maxPrice = 5000000;
    this.priceStep = 50000;
    this.minInitialFeePercantage = 20;
    this.maxInitialFeePercantage = 100;
    this.initialFeeStepPercantage = 5;
    this.minCreditSum = 0;
    this.minTerm = 1;
    this.maxTerm = 7;
    this.bankMember = false;
  }

  get interestRate() {
    let interestRate;

    if (this.price < 750000) {
      interestRate = 15;
    } else if (this.price >= 750000 && this.price < 2000000) {
      interestRate = 12.5;
    } else {
      interestRate = 9.5;
    }

    if (this.bankMember) {
      interestRate -= 0.5;
    }

    return interestRate;
  }

  get decreaseSum() {
    return 0;
  }

  connectedCallback() {
    super.connectedCallback();
    this.querySelector(".checkbox-container").append(
      document
        .querySelector(".calculator__template-checkbox_consumer-credit")
        .content.cloneNode(true)
    );

    this.querySelector(".calculator__input-container_initial-fee").remove();

    this.querySelector(".input-checkbox_bank-member").addEventListener(
      "change",
      () => {
        this.bankMember = event.currentTarget.checked;
        this.updateForm();
      }
    );
  }
}
