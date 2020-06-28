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
  const arrow = document.querySelector(".calculator__arrow");

  const optionsOpenedClass = "calculator__options_opened";
  const noBottomRadiusClass = "calculator__selected_no-bottom-radius";
  const arrowUpsidedown = "calculator__arrow_upside-down";

  initCustomSelect();

  function initCustomSelect() {
    selected.addEventListener("click", () => {
      toggleOptions();
    });
    options.forEach((item) => {
      item.addEventListener("click", () => selectOption(item));
    });
    window.addEventListener("click", checkClickOutside);
  }

  function hideOptions() {
    optionsContainer.classList.remove(optionsOpenedClass);
    selected.classList.remove(noBottomRadiusClass);
    arrow.classList.remove(arrowUpsidedown);

    optionsContainer.addEventListener("transitionend", addVisuallyHiddenClass);
  }

  function addVisuallyHiddenClass() {
    optionsWrap.classList.add("visually-hidden");
    optionsContainer.removeEventListener(
      "transitionend",
      addVisuallyHiddenClass
    );
  }

  function checkClickOutside() {
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
      arrow.classList.add(arrowUpsidedown);
    } else {
      hideOptions();
      selectValue.textContent = "Выберите цель кредита";
      select.querySelector(".calculator__option_selected") &&
        select
          .querySelector(".calculator__option_selected")
          .classList.remove("calculator__option_selected");
      arrow.classList.remove(arrowUpsidedown);

      changeCalculator();
      document.querySelector(".request").classList.add("visually-hidden");
    }
  }

  function selectOption(option) {
    select.querySelector(".calculator__option_selected") &&
      select
        .querySelector(".calculator__option_selected")
        .classList.remove("calculator__option_selected");

    arrow.classList.add(arrowUpsidedown);
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
    }
  }
}
