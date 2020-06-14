import loginPopup from "./components/login-popup";
import slider from "./components/slider";
import services from "./components/services";
import servicesSlider from "./components/services-slider";
import showOffer from "./components/showOffer";
import MortgageCalculator from "./components/mortgageCalculator";
import ConsumerCreditCalculator from "./components/consumerCreditCalculator";
import CarCreditCalculator from "./components/carCreditCalculator";
import CalculatorCustomSelect from "./components/calculatorCustomSelect";

customElements.define("mortgage-calculator", MortgageCalculator);
customElements.define("consumer-credit-calculator", ConsumerCreditCalculator);
customElements.define("car-credit-calculator", CarCreditCalculator);
loginPopup();
slider();
services();
CalculatorCustomSelect();

if (window.matchMedia("(max-width: 1023px)").matches) {
  servicesSlider();
}
