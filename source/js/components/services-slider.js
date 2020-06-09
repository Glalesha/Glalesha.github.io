export default function servicesSlider() {
  const sliderItems = document.querySelector(".services-slider__slides");
  const slides = document.querySelectorAll(".services-slider__slide");
  const controls = document.querySelectorAll(".service-menu__item input");
  let slideWidth = document.documentElement.clientWidth;

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

  sliderItems.addEventListener("transitionend", checkIndex);
  sliderItems.addEventListener("touchstart", dragStart);
  sliderItems.addEventListener("touchend", dragEnd);
  sliderItems.addEventListener("touchmove", dragAction);

  window.addEventListener("resize", function (event) {
    slideWidth2 = slideWidth;
    slideWidth = document.documentElement.clientWidth;

    sliderItems.style.transform = `translateX(${-(
      (index + 1) * slideWidth -
      (slideWidth - slideWidth2)
    )}px)`;
  });

  sliderItems.style.transform = `translateX(${-slideWidth}px)`;

  firstSlide.before(cloneLast);
  lastSlide.after(cloneFirst);

  function goTo(slideIndex) {
    if (allowShift) {
      sliderItems.classList.add("shifting");
      sliderItems.style.transform = `translateX(${
        -(slideIndex + 1) * slideWidth
      }px)`;

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
