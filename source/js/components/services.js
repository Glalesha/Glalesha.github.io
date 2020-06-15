export default function services() {
  const servicesSection = document.querySelector(".services-section");
  const services = document.querySelectorAll(".service");
  const serviceInput = document.querySelectorAll(".service-menu input");
  const serviceLabel = document.querySelectorAll(".service-menu__label");

  serviceInput.forEach((item) => {
    item.addEventListener("change", () => tabService(item.value));
  });

  serviceLabel.forEach((item, index) => {
    item.addEventListener("focus", () => {
      serviceInput[index].checked = true;
      tabService(index);
    });
  });

  function tabService(serviceIndex) {
    servicesSection
      .querySelector(".service:not(.visually-hidden_mobile)")
      .classList.add("visually-hidden_mobile");

    services[serviceIndex].classList.remove("visually-hidden_mobile");
  }
}
