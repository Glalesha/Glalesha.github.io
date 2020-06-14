export default function CalculatorCustomSelect() {
  const select = document.querySelector(".calculator__select");
  const selected = select.querySelector(".calculator__selected");
  const selectValue = select.querySelector(".calculator__select-value");
  const optionsContainer = select.querySelector(".calculator__options");
  const options = select.querySelectorAll(".calculator__option");
  const optionsOpenedClass = "calculator__options_opened";
  const noBottomRadiusClass = "calculator__selected_no-bottom-radius";

  selected.addEventListener("click", toggleOptions);
  options.forEach((item) => {
    item.addEventListener("click", () => selectOption(item));
  });
  window.addEventListener("click", checkClockOutside);

  function checkClockOutside() {
    if (!select.contains(event.target)) {
      optionsContainer.classList.remove(optionsOpenedClass);
      selected.classList.remove(noBottomRadiusClass);
    }
  }

  function toggleOptions() {
    optionsContainer.classList.toggle(optionsOpenedClass);
    selected.classList.toggle(noBottomRadiusClass);
  }

  function selectOption(option) {
    selectValue.textContent = option.textContent;
    optionsContainer.classList.remove(optionsOpenedClass);
    selected.classList.remove(noBottomRadiusClass);

    changeCalculator(option.dataset.value);
  }

  function changeCalculator(calculatorName) {
    let calculator;

    if (calculatorName === "mortgage") {
      calculator = document.createElement("mortgage-calculator");

      document.querySelector(".calculator__custom-calculator-container")
        .firstElementChild &&
        document
          .querySelector(".calculator__custom-calculator-container")
          .firstElementChild.remove();
      document
        .querySelector(".calculator__custom-calculator-container")
        .append(calculator);
    } else if (calculatorName === "car-credit") {
      calculator = document.createElement("car-credit-calculator");

      document.querySelector(".calculator__custom-calculator-container")
        .firstElementChild &&
        document
          .querySelector(".calculator__custom-calculator-container")
          .firstElementChild.remove();
      document
        .querySelector(".calculator__custom-calculator-container")
        .append(calculator);
    } else {
      document.querySelector(".calculator__custom-calculator-container")
        .firstElementChild &&
        document
          .querySelector(".calculator__custom-calculator-container")
          .firstElementChild.remove();
      calculator = document.createElement("consumer-credit-calculator");

      document
        .querySelector(".calculator__custom-calculator-container")
        .append(calculator);
    }
  }
}
