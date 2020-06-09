import loginPopup from "./components/login-popup";
import slider from "./components/slider";
import services from "./components/services";
import servicesSlider from "./components/services-slider";

loginPopup();
slider();
services();

if (window.matchMedia("(max-width: 1023px)").matches) {
  servicesSlider();
}
