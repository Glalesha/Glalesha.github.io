import loginPopup from "./components/loginPopup";
// import ThanksPopup from "./components/popups/thanksPopup";
import slider from "./components/slider";
import services from "./components/services";
import servicesSlider from "./components/services-slider";
import showOffer from "./components/showOffer";
import MortgageCalculator from "./components/mortgageCalculator";
import ConsumerCreditCalculator from "./components/consumerCreditCalculator";
import CarCreditCalculator from "./components/carCreditCalculator";
import CalculatorCustomSelect from "./components/calculatorCustomSelect";
import makeRequest from "./components/makeRequest";
import map from "./components/map";

customElements.define("mortgage-calculator", MortgageCalculator);
customElements.define("consumer-credit-calculator", ConsumerCreditCalculator);
customElements.define("car-credit-calculator", CarCreditCalculator);
loginPopup();
slider();
services();
makeRequest();
CalculatorCustomSelect();
map();

// let thanksPopup = new Popup();
// document.querySelector(".thanks-popup").onclick = function () {
//   thanksPopup.createPopup();
// };

if (window.matchMedia("(max-width: 1023px)").matches) {
  servicesSlider();
}
