export default function services() {
  const servicesSection = document.querySelector(".services");
  const sliderItems = document.querySelector(".services__list");
  const slides = document.querySelectorAll(".service");
  const controlsContainer = document.querySelector(".services__controls");
  const controls = document.querySelectorAll(".services__controls-item input");
  const serviceLabel = document.querySelectorAll(".services__controls-label");
  let slideWidth = servicesSection.clientWidth;

  const firstSlide = slides[0];
  const lastSlide = slides[slides.length - 1];
  const cloneFirst = firstSlide.cloneNode(true);
  const cloneLast = lastSlide.cloneNode(true);

  let posX1 = 0;
  let posX2 = 0;
  let posInitial;
  let offset = 0;
  let threshold = 100;
  let index = 0;
  let allowShift = true;
  let slideWidth2 = 0;

  isAllowSwipe();

  function isAllowSwipe() {
    if (window.matchMedia("(max-width: 1023px)").matches) {
      sliderItems.addEventListener("touchstart", dragStart);
      sliderItems.addEventListener("touchend", dragEnd);
      sliderItems.addEventListener("touchmove", dragAction);
    } else {
      sliderItems.removeEventListener("touchstart", dragStart);
      sliderItems.removeEventListener("touchend", dragEnd);
      sliderItems.removeEventListener("touchmove", dragAction);
    }
  }

  window.addEventListener("resize", function (event) {
    isAllowSwipe();
    slideWidth2 = slideWidth;
    slideWidth = servicesSection.clientWidth;

    sliderItems.style.transform = `translateX(${-(
      (index + 1) * slideWidth -
      (slideWidth - slideWidth2)
    )}px)`;

  });

  sliderItems.addEventListener("transitionend", checkIndex);
  controls.forEach((item) => {
    item.addEventListener("input", () => {
      goTo(item.value - 1);
    });
  });

  sliderItems.style.transform = `translateX(${-slideWidth}px)`;

  firstSlide.before(cloneLast);
  lastSlide.after(cloneFirst);

  function goTo(slideIndex) {
    if (allowShift) {
      sliderItems.classList.add("shifting");
      controlsContainer.classList.add("services__controls_disabled");
      sliderItems.style.transform = `translateX(${
        -(slideIndex + 1) * slideWidth
      }px)`;

      document.querySelector(".service_visible") &&
        document
          .querySelector(".service_visible")
          .classList.remove("service_visible");

      slides[slideIndex] && slides[slideIndex].classList.add("service_visible");

      index = slideIndex;
    }

    allowShift = false;
  }

  function checkIndex() {
    if (index === slides.length) {
      sliderItems.style.transform = `translateX(${-slideWidth}px)`;
      index = 0;
    } else if (index === -1) {
      sliderItems.style.transform = `translateX(${
        index.length * slideWidth
      }px)`;
      index = slides.length - 1;
    }

    sliderItems.classList.remove("shifting");
    controlsContainer.classList.remove("services__controls_disabled");
    allowShift = true;
  }

  function dragStart(e) {
    e.preventDefault();

    //if (!window.matchMedia("(max-width: 1023px)").matches) return;

    posX1 = e.touches[0].clientX;
    posInitial = -(index + 1) * slideWidth;
  }

  function dragAction(e) {
    posX2 = posX1 - e.touches[0].clientX;
    posX1 = e.touches[0].clientX;

    offset += posX2;
    sliderItems.style.transform = `translateX(${
      -(index + 1) * slideWidth - offset
    }px)`;
  }

  function dragEnd(e) {
    if (offset < -threshold) {
      goTo(index - 1);
      checkRadio();
    } else if (offset > threshold) {
      goTo(index + 1);
      checkRadio();
    } else {
      sliderItems.style.transform = `translateX(${posInitial}px)`;
    }

    offset = 0;
  }

  function checkRadio() {
    if (index === slides.length) {
      controls[0].checked = true;
    } else if (index === -1) {
      controls[slides.length - 1].checked = true;
    } else {
      controls[index].checked = true;
    }
  }
}
