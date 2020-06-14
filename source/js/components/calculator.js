import showOffer from "./showOffer";

export default function calculator() {
  const inputPrice = document.querySelector(".calculator__input_price");
  const inputInitialFee = document.querySelector(
    ".calculator__input_initial-fee"
  );
  const rangeInitialFee = document.querySelector(
    ".calculator__input-range_initial-fee"
  );
  const outputInitialFee = document.querySelector(
    ".calculator__input-range_initial-fee-output"
  );
  const checkBoxMaternalCapital = document.querySelector(
    ".calculator__input-maternal-capital"
  );
  const inputTerm = document.querySelector(".calculator__input_term");
  const rangeTerm = document.querySelector(".calculator__range_term");
  const outputTerm = document.querySelector(
    ".calculator__range_term-output"
  );
  const maternalCapitalSum = 470000;

  let creditData = {
    price: 0,
    initialFee: 0,
    initialFeePercantage: 0,
    creditSum: 0,
    term: 0,
    useMaternalCapital: false,
    interestRate: 0,
    monthlyPayment: 0,
    requiredIncome: 0,
  };

  inputPrice.addEventListener("input", () => calculateInitialFee());
  inputInitialFee.addEventListener("input", () => updateInitialFee());
  rangeInitialFee.addEventListener("input", () => updateInitialFeePercantage());
  checkBoxMaternalCapital.addEventListener("change", () =>
    changeMaternalCapital()
  );
  inputTerm.addEventListener("input", () => updateTerm(inputTerm.value));
  rangeTerm.addEventListener("input", () => updateTerm(rangeTerm.value));

  function calculateInitialFee() {
    creditData.price = inputPrice.value;
    creditData.initialFee = inputPrice.value / 10;
    creditData.initialFeePercantage =
      (creditData.initialFee / creditData.price) * 100;

    inputInitialFee.value = creditData.initialFee;
    rangeInitialFee.value = creditData.initialFeePercantage;
    outputInitialFee.textContent = creditData.initialFeePercantage;
    updateOffer();
  }

  function updateInitialFee() {
    if (creditData.price) {
      creditData.initialFee = inputInitialFee.value;
      creditData.initialFeePercantage =
        (creditData.initialFee / creditData.price) * 100;

      outputInitialFee.textContent = creditData.initialFeePercantage;
      rangeInitialFee.value = creditData.initialFeePercantage;
      updateOffer();
    }
  }

  function updateInitialFeePercantage() {
    if (creditData.price) {
      creditData.initialFeePercantage = rangeInitialFee.value;
      creditData.initialFee =
        (creditData.initialFeePercantage * creditData.price) / 100;

      outputInitialFee.textContent = creditData.initialFeePercantage;
      inputInitialFee.value = creditData.initialFee;
      updateOffer();
    }
  }

  function changeMaternalCapital() {
    creditData.useMaternalCapital = checkBoxMaternalCapital.checked;
    updateOffer();
  }

  function updateTerm(termValue) {
    creditData.term = termValue;

    inputTerm.value = creditData.term;
    rangeTerm.value = creditData.term;
    updateOffer();
  }

  function updateOffer() {
    creditData.creditSum =
      creditData.price -
      creditData.initialFee -
      (creditData.useMaternalCapital ? maternalCapitalSum : 0);

    if (creditData.creditSum < 500000) {
      showRefuse();
      return;
    }

    if (creditData.initialFeePercantage < 15) {
      creditData.interestRate = 9.4;
    } else {
      creditData.interestRate = 8.5;
    }

    let monthlyInterestRate = creditData.interestRate / 12 / 100;

    creditData.monthlyPayment = Math.ceil(
      creditData.creditSum *
        (monthlyInterestRate +
          monthlyInterestRate /
            ((1 + monthlyInterestRate) ** (creditData.term * 12) - 1))
    );

    creditData.requiredIncome = Math.ceil(
      (creditData.monthlyPayment * 100) / 45
    );

    showOffer(creditData);
  }

  function showRefuse() {}
}
