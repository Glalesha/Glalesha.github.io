(function () {
  'use strict';

  function forbidScroll(openButton, closeButton) {
    const body = document.querySelector("body");
    const overlay = document.querySelector(".overlay");

    overlay.addEventListener("click", () => {
      event.preventDefault();

      if (existVerticalScroll()) {
        body.classList.remove("body-lock");
        window.scrollTo(0, body.dataset.scrollY);
      }
    });

    body.dataset.scrollY = getBodyScrollTop(); // сохраним значение скролла

    if (existVerticalScroll()) {
      body.classList.add("body-lock");
      body.style.top = `-${body.dataset.scrollY}px`;
    }

    function existVerticalScroll() {
      return document.body.offsetHeight > window.innerHeight;
    }

    function getBodyScrollTop() {
      return (
        self.pageYOffset ||
        (document.documentElement && document.documentElement.ScrollTop) ||
        (document.body && document.body.scrollTop)
      );
    }

    openButton &&
      openButton.addEventListener("click", (e) => {
        e.preventDefault();

        body.dataset.scrollY = getBodyScrollTop();

        if (existVerticalScroll()) {
          // новая строка
          body.classList.add("body-lock");
          body.style.top = `-${body.dataset.scrollY}px`;
        }
      });

    closeButton.addEventListener("click", (e) => {
      e.preventDefault();

      if (existVerticalScroll()) {
        body.classList.remove("body-lock");
        window.scrollTo(0, body.dataset.scrollY);
      }
    });
  }

  function loginPopup() {
    const popup = document.querySelector(".login-popup");
    const loginForm = document.querySelector(".form-login");
    const enterButton = document.querySelector(".page-header__button-open");
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
      forbidScroll(enterButton, closeButton);

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

  function showOffer(
    creditSum,
    monthlyPayment,
    interestRate,
    requiredIncome,
    purpose,
    minCreditSum
  ) {
    const offer = document.querySelector(".offer");
    const creditSumOutput = document.querySelector(".offer__value_credit-sum");
    const monthlyPaymentOutput = document.querySelector(
      ".offer__value_monthly-payment"
    );
    const interestRateOutput = document.querySelector(
      ".offer__value_interest-rate"
    );
    const requiredIncomeOutput = document.querySelector(
      ".offer__value_required-income"
    );
    const requestContainer = document.querySelector(".request-container");

    creditSumOutput.textContent = creditSum;
    monthlyPaymentOutput.textContent = monthlyPayment;
    interestRateOutput.textContent = interestRate;
    requiredIncomeOutput.textContent = requiredIncome;

    let title;
    let priceLabel;
    let creditSumLabel;

    if (purpose === "mortgage") {
      title = `Наш банк не выдаёт ипотечные кредиты меньше ${minCreditSum} рублей.`;
      priceLabel = "Стоимость недвижимости";
      creditSumLabel = "Сумма ипотеки";
    } else if (purpose === "car-credit") {
      title = `Наш банк не выдаёт автокредиты меньше ${minCreditSum} рублей.`;
      priceLabel = "Стоимость автомобиля";
      creditSumLabel = "Сумма автокредита";
    } else if (purpose === "consumer-credit") {
      title = "";
      priceLabel = "Сумма потребительского кредита";
      creditSumLabel = "Сумма кредита";
    }

    document.querySelector(".refuse__title").textContent = title;
    document.querySelector(".calculator__label_price").textContent = priceLabel;
    document.querySelector(
      ".offer__label_credit-sum"
    ).textContent = creditSumLabel;
  }

  const ERROR_MESSAGE = `Некорректное значение`;

  class CalculatorElement extends HTMLElement {
    constructor() {
      super();
      this.price = 0;
      this.initialFee = 0;
      this.initialFeePercantage = 0;
      this.creditSum = 0;
      this.term = 0;
      this.monthlyPayment = 0;
      this.requiredIncome = 0;
      this.requiredIncomCoefficient = 45;
    }

    // Рендеринг формы и предложния

    updateForm() {
      this.inputPrice.value = this.transformValueToString(this.price, [
        "рубль",
        "рубля",
        "рублей",
      ]);

      this.inputInitialFee.value = this.transformValueToString(this.initialFee, [
        "рубль",
        "рубля",
        "рублей",
      ]);

      this.rangeInitialFee.value = this.initialFeePercantage;
      this.outputInitialFee.value = `${this.initialFeePercantage}%`;

      this.inputTerm.value = this.transformValueToString(this.term, [
        "год",
        "года",
        "лет",
      ]);

      this.rangeTerm.value = this.term;

      this.updateOffer();
    }

    updateOffer() {
      this.checkValidPrice();
      this.creditSum = this.price - this.initialFee - this.decreaseSum;

      if (this.creditSum < this.minCreditSum) {
        document.querySelector(".offer").classList.add("visually-hidden");
        document.querySelector(".refuse").classList.remove("visually-hidden");
        return;
      } else {
        document.querySelector(".offer").classList.remove("visually-hidden");
        document.querySelector(".refuse").classList.add("visually-hidden");
      }

      let monthlyInterestRate = this.interestRate / 12 / 100;

      this.monthlyPayment = Math.ceil(
        this.creditSum *
          (monthlyInterestRate +
            monthlyInterestRate /
              ((1 + monthlyInterestRate) ** (this.term * 12) - 1))
      );

      this.requiredIncome = Math.ceil(
        (this.monthlyPayment * 100) / this.requiredIncomCoefficient
      );

      showOffer(
        this.transformValueToString(this.creditSum, ["рубль", "рубля", "рублей"]),
        this.transformValueToString(this.monthlyPayment, [
          "рубль",
          "рубля",
          "рублей",
        ]),
        `${this.transformValueToString(
        this.interestRate.toFixed(2).replace(/\./, ",")
      )}%`,
        this.transformValueToString(this.requiredIncome, [
          "рубль",
          "рубля",
          "рублей",
        ]),
        this.purpose,
        this.minCreditSum
      );

      this.hideRequest();
    }

    hideRequest() {
      this.request.classList.add("visually-hidden");
    }

    updateRequest() {
      this.requestInputsUserData.forEach((input) => {
        input.value = "";
        input.classList.remove("request__input_invalid");
        input.parentNode.querySelector(
          ".request__invalid-input-message"
        ).textContent = "";
      });

      if (!this.request.classList.contains("visually-hidden")) {
        this.request.querySelector(".request__input_fullname").focus();
      }

      //slice(-4) добавляет числу лишние нули
      this.inputRequestNumber.value = `№ ${(
      "0000" +
      (+localStorage.getItem("requestsNumber") + 1)
    ).slice(-4)}`;

      if (this.purpose === "mortgage") {
        this.requestInputPurpose.value = "Ипотека";
        this.requestLabelPrice.textContent = "Стоимость недвижимости";
      } else if (this.purpose === "car-credit") {
        this.requestInputPurpose.value = "Автокредит";
        this.requestLabelPrice.textContent = "Стоимость автомобиля";
      } else if (this.purpose === "consumer-credit") {
        this.requestInputPurpose.value = "Потребительский кредит";
        this.requestLabelPrice.textContent = "Сумма кредита";
      }

      this.requestInputPrice.value = this.transformValueToString(this.price, [
        "рубль",
        "рубля",
        "рублей",
      ]);
      (this.requestInputInitialFee.value = this.transformValueToString(
        this.initialFee,
        ["рубль", "рубля", "рублей"]
      )),
        (this.requestInputTerm.value = this.transformValueToString(this.term, [
          "год",
          "лет",
          "лет",
        ]));
    }

    // Обновление значений формы

    updatePriceOnInput(priceValue) {
      this.digitsPattern(this.inputPrice);
      this.price = this.transformStringToNumber(this.inputPrice.value);

      //this.inputPrice.value = this.addSpacesInNumber(this.price);
      this.calculateMinInitialFee();
    }

    updatePriceOnStep(stepValue) {
      this.price += stepValue;

      this.checkValidPrice();
      this.calculateMinInitialFee();
      this.updateForm();
    }

    updatePriceOnBlur() {
      this.updatePriceOnInput();
      this.updateForm();
    }

    updateInitialFee() {
      this.digitsPattern(this.inputInitialFee);

      this.initialFee = Math.ceil(
        this.transformStringToNumber(this.inputInitialFee.value)
      );
      this.initialFeePercantage = this.calculateInitialFeePercantage();
    }

    updateInitialFeeOnBlur() {
      this.updateInitialFee();
      this.checkValidInitialFee();
      this.updateForm();
    }

    updateInitialFeePercantage() {
      this.initialFeePercantage = this.rangeInitialFee.value;
      this.initialFee = Math.ceil((this.initialFeePercantage * this.price) / 100);

      this.updateForm();
    }

    updateTerm() {
      this.digitsPattern(this.inputTerm);
      this.term = this.transformStringToNumber(this.inputTerm.value);
    }

    updateTermWithRange() {
      this.digitsPattern(this.rangeTerm);
      this.term = this.transformStringToNumber(this.rangeTerm.value);

      this.updateForm();
    }

    updateTermOnBlur() {
      this.updateTerm();
      this.checkValidTerm();
      this.updateForm();
    }

    // Вспомогательные функции

    checkValidPrice() {
      if (this.price > this.maxPrice || this.price < this.minPrice) {
        this.inputPrice.classList.add("calculator__input_price_invalid");
        document.querySelector(
          ".calculator__invalid-input-message"
        ).textContent = ERROR_MESSAGE;
        document
          .querySelector(".offer__button")
          .classList.add("offer__button_disabled");
      } else {
        this.inputPrice.classList.remove("calculator__input_price_invalid");
        document.querySelector(".calculator__invalid-input-message").textContent =
          "";
        document
          .querySelector(".offer__button")
          .classList.remove("offer__button_disabled");
      }
    }

    checkValidInitialFee() {
      if (this.initialFeePercantage < this.minInitialFeePercantage) {
        this.initialFee = this.price / this.minInitialFeePercantage;
        this.initialFeePercantage = this.minInitialFeePercantage;
        this.updateForm();
      } else if (this.initialFee > this.price) {
        this.initialFee = this.price;
        this.initialFeePercantage = this.maxInitialFeePercantage;
        this.updateForm();
      }
    }

    checkValidTerm() {
      if (this.term > this.maxTerm) {
        this.term = this.maxTerm;
      } else if (this.term < this.minTerm) {
        this.term = this.minTerm;
      }
    }

    calculateMinInitialFee() {
      this.initialFee = Math.ceil(
        (this.price / 100) * this.minInitialFeePercantage
      );
      this.initialFeePercantage = this.calculateInitialFeePercantage();
    }

    calculateInitialFeePercantage() {
      return Math.round((this.initialFee / this.price) * 100);
    }

    transformValueToString(number, units) {
      let unit;
      if (units) {
        unit = ` ${this.plural(number, units)}`;
      } else {
        unit = "";
      }
      return `${this.addSpacesInNumber(number)}${unit}`;
    }

    addSpacesInNumber(number) {
      return number.toString().replace(/(\d)(?=(\d{3})+([^\d]|$))/g, "$1 ");
    }

    digitsPattern(input) {
      input.value = input.value.replace(/[^0-9 ]/, "");
    }

    transformStringToNumber(str) {
      return +str.replace(/\D/g, "");
    }

    hideWords(input) {
      input.value = this.transformStringToNumber(input.value);
      // this.addSpacesInNumber(
      //   this.transformStringToNumber(input.value)
      // );
    }

    plural(number, units) {
      number = Math.abs(number);
      number %= 100;
      if (number >= 5 && number <= 20) {
        return units[2];
      }
      number %= 10;
      if (number === 1) {
        return units[0];
      }
      if (number >= 2 && number <= 4) {
        return units[1];
      }
      return units[2];
    }

    connectedCallback() {
      this.append(
        document.querySelector(".calculator-template").content.cloneNode(true)
      );

      this.inputPrice = this.querySelector(".calculator__input_price");
      this.inputInitialFee = this.querySelector(".calculator__input_initial-fee");
      this.rangeInitialFee = this.querySelector(
        ".calculator__input-range_initial-fee"
      );
      this.outputInitialFee = this.querySelector(
        ".calculator__range-extra-text_initial-fee-output"
      );
      this.inputTerm = this.querySelector(".calculator__input_term");

      this.rangeTerm = this.querySelector(".calculator__range_term");
      this.querySelector(".calculator__range-extra-text__min").textContent = `${
      this.minTerm
    } ${this.plural(this.minTerm, ["год", "лет", "лет"])}`;
      this.querySelector(".calculator__range-extra-text__max").textContent = `${
      this.maxTerm
    } ${this.plural(this.maxTerm, ["год", "лет", "лет"])}`;

      this.priceLabel = this.querySelector(".calculator__range-extra-text_price");
      this.request = document.querySelector(".request");
      this.inputRequestNumber = this.request.querySelector(
        ".request__input_request-number"
      );
      this.requestInputPurpose = this.request.querySelector(
        ".request__input_purpose"
      );
      this.requestInputPrice = this.request.querySelector(
        ".request__input_price"
      );
      this.requestInputInitialFee = this.request.querySelector(
        ".request__input_initial-fee"
      );
      this.requestInputTerm = this.request.querySelector(".request__input_term");
      this.requestLabelPrice = this.request.querySelector(
        ".request__label_price"
      );
      this.requestInputsUserData = this.request.querySelectorAll(
        ".request__input_user-data"
      );
      const requestInputFullname = this.request.querySelector(
        ".request__input_fullname"
      );
      const requestInputTelephone = this.request.querySelector(
        ".request__input_phone-number"
      );
      const requestInputEmail = this.request.querySelector(
        ".request__input_email"
      );

      this.priceLabel.textContent = `От ${this.transformValueToString(
      this.minPrice
    )} до ${this.transformValueToString(this.maxPrice)} рублей`;

      this.inputPrice.min = this.minPrice;
      this.inputPrice.max = this.maxPrice;
      this.inputPrice.step = this.priceStep;

      this.rangeInitialFee.min = this.minInitialFeePercantage;
      this.rangeInitialFee.max = 100;
      this.rangeInitialFee.step = this.initialFeeStepPercantage;

      this.inputTerm.min = this.minTerm;
      this.inputTerm.max = this.maxTerm;
      this.rangeTerm.min = this.minTerm;
      this.rangeTerm.max = this.maxTerm;

      this.price = this.minPrice;
      this.term = this.minTerm;

      this.calculateMinInitialFee();
      this.updateForm();

      this.inputPrice.addEventListener("focus", () =>
        this.hideWords(this.inputPrice)
      );
      this.inputPrice.addEventListener("blur", () => this.updatePriceOnBlur());
      this.inputPrice.addEventListener("input", () => this.updatePriceOnInput());

      this.inputInitialFee.addEventListener("focus", () =>
        this.hideWords(this.inputInitialFee)
      );
      this.inputInitialFee.addEventListener("blur", () =>
        this.updateInitialFeeOnBlur()
      );
      this.inputInitialFee.addEventListener("input", () =>
        this.updateInitialFee()
      );
      this.inputInitialFee.addEventListener("input", () =>
        this.updateInitialFee()
      );
      this.rangeInitialFee.addEventListener("input", () =>
        this.updateInitialFeePercantage()
      );

      this.inputTerm.addEventListener("focus", () =>
        this.hideWords(this.inputTerm)
      );
      this.inputTerm.addEventListener("blur", () => {
        this.updateTermOnBlur();
      });
      this.inputTerm.addEventListener("input", () =>
        this.updateTerm(this.inputTerm)
      );
      this.rangeTerm.addEventListener("input", () =>
        this.updateTermWithRange(this.rangeTerm)
      );

      this.querySelector(".calculator__step-up").addEventListener("click", () => {
        this.updatePriceOnStep(this.priceStep);
      });

      this.querySelector(".calculator__step-down").addEventListener(
        "click",
        () => {
          this.updatePriceOnStep(-this.priceStep);
        }
      );
      document.querySelector(".offer__button").addEventListener("click", () => {
        this.request.classList.remove("visually-hidden");
        this.updateRequest();
      });
    }
  }

  class MortgageCalculator extends CalculatorElement {
    constructor() {
      super();
      this.purpose = "mortgage";
      this.minPrice = 1200000;
      this.maxPrice = 25000000;
      this.priceStep = 100000;
      this.minInitialFeePercantage = 10;
      this.maxInitialFeePercantage = 100;
      this.initialFeeStepPercantage = 5;
      this.minCreditSum = 500000;
      this.minTerm = 5;
      this.maxTerm = 30;
      this.maternalCapitalSum = 470000;
      this.useMaternalCapital = false;
    }

    get interestRate() {
      if (this.initialFeePercantage < 15) {
        return 9.4;
      } else {
        return 8.5;
      }
    }

    get decreaseSum() {
      return this.useMaternalCapital ? this.maternalCapitalSum : 0;
    }

    connectedCallback() {
      super.connectedCallback();
      this.querySelector(".calculator__extra-options").append(
        document
          .querySelector(".calculator__template-checkbox_mortgage")
          .content.cloneNode(true)
      );

      this.querySelector(".input-checkbox").addEventListener("change", () => {
        this.useMaternalCapital = event.currentTarget.checked;
        this.updateForm();
      });
    }
  }

  class ConsumerCreditCalculator extends CalculatorElement {
    constructor() {
      super();
      this.purpose = "consumer-credit";
      this.minPrice = 800000;
      this.maxPrice = 5000000;
      this.priceStep = 50000;
      this.minInitialFeePercantage = 20;
      this.maxInitialFeePercantage = 100;
      this.initialFeeStepPercantage = 5;
      this.minCreditSum = 0;
      this.minTerm = 1;
      this.maxTerm = 7;
      this.bankMember = false;
    }

    get interestRate() {
      let interestRate;

      if (this.price < 750000) {
        interestRate = 15;
      } else if (this.price >= 750000 && this.price < 2000000) {
        interestRate = 12.5;
      } else {
        interestRate = 9.5;
      }

      if (this.bankMember) {
        interestRate -= 0.5;
      }

      return interestRate;
    }

    get decreaseSum() {
      return 0;
    }

    connectedCallback() {
      super.connectedCallback();
      this.querySelector(".calculator__extra-options").append(
        document
          .querySelector(".calculator__template-checkbox_consumer-credit")
          .content.cloneNode(true)
      );

      this.querySelector(".calculator__input-container_initial-fee").remove();

      this.querySelector(".input-checkbox_bank-member").addEventListener(
        "change",
        () => {
          this.bankMember = event.currentTarget.checked;
          this.updateForm();
        }
      );
    }
  }

  class CarCreditCalculator extends CalculatorElement {
    constructor() {
      super();
      this.purpose = "car-credit";
      this.minPrice = 500000;
      this.maxPrice = 5000000;
      this.priceStep = 50000;
      this.minInitialFeePercantage = 20;
      this.maxInitialFeePercantage = 100;
      this.initialFeeStepPercantage = 5;
      this.minCreditSum = 200000;
      this.minTerm = 1;
      this.maxTerm = 5;
      this.casco = false;
      this.lifeInsurance = false;
    }

    get interestRate() {
      if (this.casco && this.lifeInsurance) {
        return 3.5;
      } else if (this.casco || this.lifeInsurance) {
        return 8.5;
      } else if (this.price >= 2000000) {
        return 15;
      } else {
        return 16;
      }
    }

    get decreaseSum() {
      return 0;
    }

    connectedCallback() {
      super.connectedCallback();
      this.querySelector(".calculator__extra-options").append(
        document
          .querySelector(".calculator__template-checkbox_car-credit")
          .content.cloneNode(true)
      );

      this.querySelector(".input-checkbox_casco").addEventListener(
        "change",
        () => {
          this.casco = event.currentTarget.checked;
          this.updateForm();
        }
      );

      this.querySelector(".input-checkbox_life-insurance").addEventListener(
        "change",
        () => {
          this.lifeInsurance = event.currentTarget.checked;
          this.updateForm();
        }
      );
    }
  }

  function CalculatorCustomSelect() {
    const select = document.querySelector(".calculator__select");
    const selected = select.querySelector(".calculator__selected");
    const selectValue = select.querySelector(".calculator__select-value");
    const optionsWrap = select.querySelector(".calculator__options-wrap");
    const optionsContainer = select.querySelector(".calculator__options");
    const options = select.querySelectorAll(".calculator__option");
    const customCalculatorContainer = document.querySelector(
      ".calculator__custom-calculator-container"
    );
    const offer = document.querySelector(".offer");
    const requestContainer = document.querySelector(".request-container");
    const arrow = document.querySelector(".calculator__arrow");

    const optionsOpenedClass = "calculator__options_opened";
    const noBottomRadiusClass = "calculator__selected_no-bottom-radius";
    const arrowUpsidedown = "calculator__arrow_upside-down";

    initCustomSelect();

    function initCustomSelect() {
      selected.addEventListener("click", () => {
        toggleOptions();
      });
      options.forEach((item) => {
        item.addEventListener("click", () => selectOption(item));
      });
      window.addEventListener("click", checkClickOutside);
    }

    function hideOptions() {
      optionsContainer.classList.remove(optionsOpenedClass);
      selected.classList.remove(noBottomRadiusClass);
      arrow.classList.remove(arrowUpsidedown);

      optionsContainer.addEventListener("transitionend", addVisuallyHiddenClass);
    }

    function addVisuallyHiddenClass() {
      optionsWrap.classList.add("visually-hidden");
      optionsContainer.removeEventListener(
        "transitionend",
        addVisuallyHiddenClass
      );
    }

    function checkClickOutside() {
      if (
        !select.contains(event.target) &&
        optionsContainer.classList.contains(optionsOpenedClass)
      ) {
        hideOptions();
      }
    }

    function toggleOptions() {
      if (optionsWrap.classList.contains("visually-hidden")) {
        optionsWrap.classList.remove("visually-hidden");
        optionsContainer.classList.add(optionsOpenedClass);
        selected.classList.add(noBottomRadiusClass);
        arrow.classList.add(arrowUpsidedown);
      } else {
        hideOptions();
        selectValue.textContent = "Выберите цель кредита";
        select.querySelector(".calculator__option_selected") &&
          select
            .querySelector(".calculator__option_selected")
            .classList.remove("calculator__option_selected");
        arrow.classList.remove(arrowUpsidedown);

        changeCalculator();
        document.querySelector(".request").classList.add("visually-hidden");
      }
    }

    function selectOption(option) {
      select.querySelector(".calculator__option_selected") &&
        select
          .querySelector(".calculator__option_selected")
          .classList.remove("calculator__option_selected");

      arrow.classList.add(arrowUpsidedown);
      option.classList.add("calculator__option_selected");
      selectValue.textContent = option.textContent;
      optionsContainer.classList.remove(optionsOpenedClass);
      selected.classList.remove(noBottomRadiusClass);
      hideOptions();

      changeCalculator(option.dataset.value);
    }

    function changeCalculator(calculatorName) {
      let calculator;

      customCalculatorContainer.firstElementChild &&
        customCalculatorContainer.firstElementChild.remove();

      if (calculatorName === "mortgage") {
        calculator = document.createElement("mortgage-calculator");
        customCalculatorContainer.append(calculator);
        customCalculatorContainer.classList.remove("visually-hidden");
      } else if (calculatorName === "car-credit") {
        calculator = document.createElement("car-credit-calculator");
        customCalculatorContainer.append(calculator);
        customCalculatorContainer.classList.remove("visually-hidden");
      } else if (calculatorName === "consumer-credit") {
        calculator = document.createElement("consumer-credit-calculator");
        customCalculatorContainer.append(calculator);
        customCalculatorContainer.classList.remove("visually-hidden");
      } else {
        offer.classList.add("visually-hidden");
      }
    }
  }

  function makeRequest(purpose, price, initialFee, term) {
    const requestContainer = document.querySelector(".request-container");
    const requestTemplate = document.querySelector(".request-template");
    const request = document.querySelector(".request");
    const requestForm = document.querySelector(".request__form");
    const inputRequestNumber = request.querySelector(
      ".request__input_request-number"
    );
    const inputPurpose = request.querySelector(".request__input_purpose");
    const inputPrice = request.querySelector(".request__input_price");
    const inputInitialFee = request.querySelector(".request__input_initial-fee");
    const inputTerm = request.querySelector(".request__input_term");
    const labelPrice = request.querySelector(".request__label_price");
    const inputsUserData = request.querySelectorAll(".request__input_user-data");
    const inputFullname = request.querySelector(".request__input_fullname");
    const inputTelephone = request.querySelector(".request__input_phone-number");
    const inputEmail = request.querySelector(".request__input_email");
    const popup = document.querySelector(".thanks-popup");
    const closeButton = document.querySelector(".thanks-popup__close");
    const overlay = document.querySelector(".overlay");
    const select = document.querySelector(".calculator__select");
    const selected = select.querySelector(".calculator__selected");
    const selectValue = select.querySelector(".calculator__select-value");
    const optionsWrap = select.querySelector(".calculator__options-wrap");
    const optionsContainer = select.querySelector(".calculator__options");
    const options = select.querySelectorAll(".calculator__option");
    const customCalculatorContainer = document.querySelector(
      ".calculator__custom-calculator-container"
    );
    const offer = document.querySelector(".offer");
    const arrow = document.querySelector(".calculator__arrow");
    const arrowUpsidedown = "calculator__arrow_upside-down";

    initRequest();

    function initRequest() {
      inputsUserData.forEach((input) => {
        input.addEventListener("change", () => {
          checkEmpty(input);
          checkInputValidity(input);
        });
      });
      requestForm.addEventListener("submit", submitForm);

      if (localStorage.getItem("user-data") === null) {
        localStorage.setItem("user-data", []);
      }
    }

    function checkEmpty(input) {
      input.nextElementSibling;
      if (!input.value.length) {
        input.nextElementSibling.classList.remove("request__label_moved");
      } else {
        input.nextElementSibling.classList.add("request__label_moved");
      }
    }

    function checkInputValidity(input) {
      if (input.value) {
        input.classList.remove("request__input_invalid");
        input.parentNode.querySelector(
          ".request__invalid-input-message"
        ).textContent = "";
      }

      if (
        input.classList.contains("request__input_phone-number") &&
        !/\W/.test(input.value)
      ) {
        input.classList.remove("request__input_invalid");
        input.parentNode.querySelector(
          ".request__invalid-input-message"
        ).textContent = "";
      }
    }

    function submitForm() {
      event.preventDefault();

      if (!isFormVaild()) {
        request.classList.add("request_invalid");

        request.addEventListener("animationend", removeAnimation);

        function removeAnimation() {
          request.classList.remove("request_invalid");
          request.removeEventListener("animationend", removeAnimation);
        }
        return;
      }

      localStorage.setItem(
        "requestsNumber",
        +localStorage.getItem("requestsNumber") + 1
      );

      localStorage.getItem("user-data");

      localStorage.setItem(
        "user-data",
        JSON.stringify([
          //...localStorage.getItem("user-data"),
          {
            fullName: inputFullname.value,
            telephone: inputTelephone.value,
            email: inputEmail.value,
            number: localStorage.getItem("requestsNumber"),
          },
        ])
      );

      openPopup();
      forbidScroll(null, closeButton);

      inputFullname.value = "";
      inputTelephone.value = "";
      inputEmail.value = "";
    }

    function isFormVaild() {
      let errorCount = Array.from(inputsUserData).reduce((errorCount, item) => {
        if (!item.value) {
          item.classList.add("request__input_invalid");
          item.parentNode.querySelector(
            ".request__invalid-input-message"
          ).textContent = "Требуется ввести значение";
          errorCount++;
        } else if (
          item.classList.contains("request__input_phone-number") &&
          /\D/.test(item.value)
        ) {
          item.classList.add("request__input_invalid");
          item.parentNode.querySelector(
            ".request__invalid-input-message"
          ).textContent = "В номере телефона могут быть только цифры";
          errorCount++;
        }

        return errorCount;
      }, 0);

      if (!errorCount) {
        return true;
      } else {
        return false;
      }
    }

    function close() {
      overlay.style.display = "none";
      popup.classList.remove("login-popup_open");
      popup.classList.add("visually-hidden");

      selectValue.textContent = "Выберите цель кредита";
      select.querySelector(".calculator__option_selected") &&
        select
          .querySelector(".calculator__option_selected")
          .classList.remove("calculator__option_selected");
      arrow.classList.remove(arrowUpsidedown);

      customCalculatorContainer.firstElementChild &&
        customCalculatorContainer.firstElementChild.remove();

      request.classList.add("visually-hidden");
      offer.classList.add("visually-hidden");
    }

    function closeOnEsc() {
      if (event.key === "Escape") {
        close();
      }
    }

    function openPopup() {
      popup.classList.remove("visually-hidden");
      popup.classList.add("request-popup_open");
      closeButton.addEventListener(
        "click",
        () => {
          close();
        },
        { once: true }
      );

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
  }

  function map() {
    let allMarkers = [
      { city: "Moscow", lat: 55.755246, lng: 37.623246, category: "russia" },
      {
        city: "StPetersburg",
        lat: 59.928421,
        lng: 30.313006,
        category: "Russia",
      },
      { city: "Saratov", lat: 51.546444, lng: 46.005824, category: "russia" },
      { city: "Kirovsk", lat: 67.648319, lng: 33.65728, category: "russia" },
      { city: "Tyumen", lat: 57.157769, lng: 65.54334, category: "russia" },
      { city: "Omsk", lat: 55.000395, lng: 73.363669, category: "russia" },
      { city: "Paris", lat: 48.860798, lng: 2.344856, category: "europe" },
      { city: "Prague", lat: 50.08639, lng: 14.414004, category: "europe" },
      { city: "London", lat: 51.481117, lng: -0.173702, category: "europe" },
      { city: "Rome", lat: 41.894663, lng: 12.484676, category: "europe" },
      { city: "Baku", lat: 40.395094, lng: 49.883454, category: "cis" },
      { city: "Tashkent", lat: 41.292895, lng: 69.249496, category: "cis" },
      { city: "Minsk", lat: 53.90303, lng: 27.565558, category: "cis" },
      { city: "Alma-Ata", lat: 43.223741, lng: 76.865075, category: "cis" },
    ];

    let markers = [];

    const checkboxs = document.querySelectorAll(".branches__checkbox");

    window.initMap = initMap;

    let categories = {
      russia: true,
      cis: true,
      europe: true,
    };

    checkboxs.forEach((item) => {
      item.addEventListener("change", () => {
        updateCategories(item);
        filterMarkers();
      });
    });

    function updateCategories({ value, checked }) {
      categories[value] = checked;
    }

    function filterMarkers() {
      markers.forEach((item) => {
        if (categories[item.category]) {
          item.setVisible(true);
        } else {
          item.setVisible(false);
        }
      });
    }

    function initMap() {
      let center = new google.maps.LatLng(56.804286, 60.644154);
      let mapOptions = {
        zoom: 5,
        center: center,
        disableDefaultUI: true,
      };

      let map = new google.maps.Map(document.querySelector(".map"), mapOptions);

      let zoomControlDiv = document.createElement("div");
      zoomControlDiv.classList.add("map__controls");
      let zoomControl = new ZoomControl(zoomControlDiv, map);

      zoomControlDiv.index = 1;
      map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(zoomControlDiv);

      addYourLocationButton(map, zoomControlDiv);

      allMarkers.forEach((item) => {
        let marker = new google.maps.Marker({
          title: item.name,
          position: { lat: item.lat, lng: item.lng },
          category: item.category,
          map: map,
          icon: "../img/map-marker.svg",
        });

        markers.push(marker);
      });
    }

    function addYourLocationButton(map, controlDiv) {
      let geolocationContainer = document.createElement("button");
      geolocationContainer.classList.add("map__geolocation-container");

      controlDiv.appendChild(geolocationContainer);

      let geolocation = document.createElement("div");
      geolocation.classList.add("map__geolocation");
      geolocationContainer.appendChild(geolocation);

      geolocationContainer.addEventListener("click", function () {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function (position) {
            let latlng = new google.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude
            );
            map.setCenter(latlng);
          });
        }
      });

      controlDiv.index = 1;
    }

    function ZoomControl(controlDiv, map) {
      let zoomControlsContainer = document.createElement("div");
      zoomControlsContainer.classList.add("map__zoom-controls-container");

      controlDiv.appendChild(zoomControlsContainer);

      let zoomInButton = document.createElement("div");
      zoomInButton.classList.add("map__zoom-in-button");

      zoomInButton.textContent = "+";
      zoomControlsContainer.appendChild(zoomInButton);

      let zoomOutButton = document.createElement("div");
      zoomOutButton.classList.add("map__zoom-out-button");
      zoomOutButton.textContent = "_";
      zoomControlsContainer.appendChild(zoomOutButton);

      google.maps.event.addDomListener(zoomInButton, "click", function () {
        map.setZoom(map.getZoom() + 1);
      });

      google.maps.event.addDomListener(zoomOutButton, "click", function () {
        map.setZoom(map.getZoom() - 1);
      });
    }
  }

  customElements.define("mortgage-calculator", MortgageCalculator);
  customElements.define("consumer-credit-calculator", ConsumerCreditCalculator);
  customElements.define("car-credit-calculator", CarCreditCalculator);
  loginPopup();
  slider();
  services();
  makeRequest();
  CalculatorCustomSelect();
  map();

}());

//# sourceMappingURL=main.js.map
