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
      .querySelector(".service:not(.visually-hidden)")
      .classList.add("visually-hidden");

    services[serviceIndex].classList.remove("visually-hidden");
  }
}
