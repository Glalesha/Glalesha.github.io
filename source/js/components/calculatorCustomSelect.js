export default function CalculatorCustomSelect() {
  const select = document.querySelector(".calculator__select");
  const selected = select.querySelector(".calculator__selected");
  const selectValue = select.querySelector(".calculator__select-value");
  const optionsWrap = select.querySelector(".calculator__options-wrap");
  const optionsContainer = select.querySelector(".calculator__options");
  const options = select.querySelectorAll(".calculator__option");
  const customCalculatorContainer = document.querySelector(
    ".calculator__custom-calculator-container"
  );
  const offer = document.querySelector(".offer");
  const request = document.querySelector(".request");
  const optionsOpenedClass = "calculator__options_opened";
  const noBottomRadiusClass = "calculator__selected_no-bottom-radius";

  selected.addEventListener("click", toggleOptions);
  options.forEach((item) => {
    item.addEventListener("click", () => selectOption(item));
  });
  window.addEventListener("click", checkClockOutside);

  function hideOptions() {
    optionsContainer.classList.remove(optionsOpenedClass);
    selected.classList.remove(noBottomRadiusClass);
    optionsContainer.addEventListener("transitionend", addVisuallyHiddenClass);
  }

  function addVisuallyHiddenClass() {
    optionsWrap.classList.add("visually-hidden");
    optionsContainer.removeEventListener(
      "transitionend",
      addVisuallyHiddenClass
    );
  }

  function checkClockOutside() {
    if (
      !select.contains(event.target) &&
      optionsContainer.classList.contains(optionsOpenedClass)
    ) {
      hideOptions();
    }
  }

  function toggleOptions() {
    if (optionsWrap.classList.contains("visually-hidden")) {
      optionsWrap.classList.remove("visually-hidden");
      optionsContainer.classList.add(optionsOpenedClass);
      selected.classList.add(noBottomRadiusClass);
    } else {
      hideOptions();
      changeCalculator();
    }
  }

  function selectOption(option) {
    select.querySelector(".calculator__option_selected") &&
      select
        .querySelector(".calculator__option_selected")
        .classList.remove("calculator__option_selected");

    option.classList.add("calculator__option_selected");
    selectValue.textContent = option.textContent;
    optionsContainer.classList.remove(optionsOpenedClass);
    selected.classList.remove(noBottomRadiusClass);
    hideOptions();

    changeCalculator(option.dataset.value);
  }

  function changeCalculator(calculatorName) {
    let calculator;

    customCalculatorContainer.firstElementChild &&
      customCalculatorContainer.firstElementChild.remove();

    if (calculatorName === "mortgage") {
      calculator = document.createElement("mortgage-calculator");
      customCalculatorContainer.append(calculator);
      customCalculatorContainer.classList.remove("visually-hidden");
    } else if (calculatorName === "car-credit") {
      calculator = document.createElement("car-credit-calculator");
      customCalculatorContainer.append(calculator);
      customCalculatorContainer.classList.remove("visually-hidden");
    } else if (calculatorName === "consumer-credit") {
      calculator = document.createElement("consumer-credit-calculator");
      customCalculatorContainer.append(calculator);
      customCalculatorContainer.classList.remove("visually-hidden");
    } else {
      offer.classList.add("visually-hidden");
      request.classList.add("visually-hidden");
    }
  }
}
