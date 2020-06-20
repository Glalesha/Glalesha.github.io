import loginPopup from "./components/loginPopup";
import topSlider from "./components/topSlider";
import services from "./components/services";
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
topSlider();
services();
makeRequest();
CalculatorCustomSelect();
map();
