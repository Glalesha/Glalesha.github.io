import loginPopup from "./components/login-popup";
import slider from "./components/slider";
import services from "./components/services";
import servicesSlider from "./components/services-slider";
import showOffer from "./components/showOffer";
import MortgageCalculator from "./components/mortgageCalculator";
import ConsumerCreditCalculator from "./components/consumerCreditCalculator";
import CarCreditCalculator from "./components/carCreditCalculator";

customElements.define("mortgage-calculator", MortgageCalculator);
customElements.define("consumer-credit-calculator", ConsumerCreditCalculator);
customElements.define("car-credit-calculator", CarCreditCalculator);
loginPopup();
slider();
services();

if (window.matchMedia("(max-width: 1023px)").matches) {
  servicesSlider();
}

document
  .querySelector(".calculator__input-purpose")
  .addEventListener("change", () => changeCalculator());

function changeCalculator() {
  // document.querySelectorAll(".customCalculator").forEach((item) => {
  //   item.classList.add("visually-hidden");
  // });

  let calculator;

  if (event.currentTarget.value === "mortgage") {
    calculator = document.createElement("mortgage-calculator");

    document.querySelector(".calculator__custom-calculator-container")
      .firstElementChild &&
      document
        .querySelector(".calculator__custom-calculator-container")
        .firstElementChild.remove();
    document
      .querySelector(".calculator__custom-calculator-container")
      .append(calculator);
    // document
    //   .querySelector(".mortgageCalculator")
    //   .classList.remove("visually-hidden");
  } else if (event.currentTarget.value === "carCredit") {
    // document
    //   .querySelector(".carCreditCalculator")
    //   .classList.remove("visually-hidden");
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
    // document
    //   .querySelector(".consumerCreditCalculator")
    //   .classList.remove("visually-hidden");
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

//calculator();
