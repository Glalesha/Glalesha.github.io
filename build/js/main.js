(function () {
  'use strict';

  function loginPopup() {
    const popup = document.querySelector(".login-popup");
    const loginForm = document.querySelector(".form-login");
    const enterButton = document.querySelector(".enter-button");
    const closeButton = document.querySelector(".close-button");
    const showPasswordButton = document.querySelector(".password__show");
    const overlay = document.querySelector(".overlay");
    const login = document.querySelector(".login-input input");
    const password = document.querySelector(".password-input input");

    enterButton.addEventListener("click", showLoginPopup);
    showPasswordButton.addEventListener("mousedown", showPassword);
    loginForm.addEventListener("submit", loginFormSubmit);

    function close() {
      overlay.style.display = "none";
      popup.classList.remove("login-popup_open");

      popup.addEventListener(
        "transitionend",
        () => {
          popup.style.visibility = "hidden";
          login.value = "";
          password.value = "";
        },
        { once: true }
      );
    }

    function closeOnEsc() {
      if (event.key === "Escape") {
        close();
      }
    }

    function showLoginPopup() {
      popup.style.visibility = "visible";
      popup.classList.add("login-popup_open");
      login.focus();

      overlay.style.height = `${Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    )}px`;
      overlay.style.display = "block";
      overlay.onclick = function () {
        close();
      };

      popup.addEventListener("keydown", closeOnEsc);
      closeButton.addEventListener("click", close, { once: true });
    }

    function showPassword() {
      this.addEventListener("pointerup", hidePassword, { once: true });
      this.addEventListener("pointerleave", hidePassword, { once: true });
      this.addEventListener("touchend", hidePassword, { once: true });
      this.classList.add("password__show_hold");

      function hidePassword() {
        password.setAttribute("type", "password");
        this.classList.remove("password__show_hold");
      }

      password.setAttribute("type", "text");
    }

    function loginFormSubmit() {
      event.preventDefault();
      localStorage.setItem("login", login.value);
      localStorage.setItem("password", password.value);
      login.value = "";
      password.value = "";
    }
  }

  function slider() {
    const sliderItems = document.querySelector(".slider__slides");
    const slides = document.querySelectorAll(".slider__slide");
    const controls = document.querySelectorAll(".controls__button input");
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
    controls.forEach((item) => {
      item.addEventListener("input", () => goTo(item.value - 1));
    });

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

    function createTimer() {
      return setInterval(() => {
        shiftSlide();
      }, 4000);
    }

    let timer = createTimer();

    function shiftSlide() {
      if (allowShift) {
        index++;

        sliderItems.classList.add("shifting");
        sliderItems.style.transform = `translateX(${
        -(index + 1) * slideWidth
      }px)`;
      }

      checkRadio();

      allowShift = false;
    }

    function goTo(slideIndex) {
      if (allowShift) {
        sliderItems.classList.add("shifting");
        clearInterval(timer);
        sliderItems.style.transform = `translateX(${
        -(slideIndex + 1) * slideWidth
      }px)`;

        index = slideIndex;
        timer = createTimer();
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
      clearInterval(timer);

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
        timer = createTimer();
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

  function services() {
    const servicesSection = document.querySelector(".services");
    const services = document.querySelectorAll(".service");
    const serviceInput = document.querySelectorAll(".services input");
    const serviceLabel = document.querySelectorAll(".services label");

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

  loginPopup();
  slider();
  services();

}());

//# sourceMappingURL=main.js.map
