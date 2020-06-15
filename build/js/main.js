(function () {
  'use strict';

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

  function servicesSlider() {
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

  function makeRequest(purpose, price, initialFee, term) {
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
    const userInfoInputs = request.querySelectorAll(".request__input");
    const inputFullname = request.querySelector(".request__input_fullname");
    const inputTelephone = request.querySelector(".request__input_phone-number");
    const inputEmail = request.querySelector(".request__input_email");

    inputFullname.focus();
    userInfoInputs.forEach((item) => {
      item.addEventListener("change", () => checkEmpty(item));
    });
    requestForm.addEventListener("submit", submitForm);

    function checkEmpty(input) {
      input.nextElementSibling;
      if (!input.value.length) {
        input.nextElementSibling.classList.remove("request__label_moved");
      } else {
        input.nextElementSibling.classList.add("request__label_moved");
      }
    }

    if (localStorage.getItem("user-data") === null) {
      localStorage.setItem("user-data", []);
    }

    //slice(-4) добавляет числу лишние нули
    inputRequestNumber.value = `№ ${(
    "0000" +
    (+localStorage.getItem("requestsNumber") + 1)
  ).slice(-4)}`;

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

      localStorage.setItem("user-data", [
        //...localStorage.getItem("user-data"),
        {
          fullName: inputFullname.value,
          telephone: inputTelephone.value,
          email: inputEmail.value,
          number: +localStorage.getItem("requestsNumber") + 1,
        },
      ]);

      inputFullname.value = "";
      inputTelephone.value = "";
      inputEmail.value = "";
    }

    function isFormVaild() {
      if (
        inputFullname.value.length &&
        inputTelephone.value.length &&
        inputEmail.value.length
      ) {
        return true;
      } else {
        return false;
      }
    }

    request.classList.remove("visually-hidden");

    if (purpose === "mortgage") {
      inputPurpose.value = "Ипотека";
      labelPrice.textContent = "Стоимость недвижимости";
    } else if (purpose === "car-credit") {
      inputPurpose.value = "Автокредит";
      labelPrice.textContent = "Стоимость автомобиля";
    } else {
      inputPurpose.value = "Потребительский кредит";
      labelPrice.textContent = "Сумма кредита";
    }

    inputPrice.value = price;
    inputInitialFee.value = initialFee;
    inputTerm.value = term;
  }

  const ERROR_MESSAGE = `Некорректное значение`;

  class CalculatorElement extends HTMLElement {
    constructor(defaultPrice, defaultTerm) {
      super();
      this.price = 0;
      this.initialFee = 0;
      this.initialFeePercantage = 0;
      this.creditSum = 0;
      this.term = 0;
      this.monthlyPayment = 0;
      this.requiredIncome = 0;
      this.requiredIncomCoefficient = 45;
      this.cursorPositionInputPrice = null;
    }

    updateForm() {
      this.inputPrice.value = this.transformValueToString(this.price, [
        "рубль",
        "рубля",
        "рублей",
      ]);

      this.inputPrice.selectionStart =
        this.inputPrice.value.length - this.cursorPositionInputPrice;
      this.inputPrice.selectionEnd = this.inputPrice.selectionStart;

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
    }

    updatePrice(priceValue) {
      if (priceValue) {
        this.price += priceValue;
      } else {
        this.saveCursorPosition(this.inputPrice, "cursorPositionInputPrice");

        this.digitsPattern(this.inputPrice);
        this.price = this.transformStringToNumber(this.inputPrice.value);
      }

      this.checkValidPrice();
      this.calculateMinInitialFee();
      this.updateForm();
    }

    updateInitialFee() {
      this.digitsPattern(this.inputInitialFee);
      this.saveCursorPosition(
        this.inputInitialFee,
        "cursorPositionInputInitialFee"
      );
      this.initialFee = Math.ceil(
        this.transformStringToNumber(this.inputInitialFee.value)
      );
      this.initialFeePercantage = this.calculateInitialFeePercantage();

      this.updateForm();
    }

    updateInitialFeePercantage() {
      this.initialFeePercantage = this.rangeInitialFee.value;
      this.initialFee = Math.ceil((this.initialFeePercantage * this.price) / 100);

      this.updateForm();
    }

    updateTerm(termInput) {
      this.digitsPattern(termInput);
      this.saveCursorPosition(this.inputTerm, "cursorPositionInputTerm");
      this.term = this.transformStringToNumber(termInput.value);

      this.updateForm();
    }

    saveCursorPosition(input, cursorName) {
      if (/[0-9]/.test(input.value[input.selectionStart - 1])) {
        this[cursorName] = input.value.length - input.selectionStart;
      } else {
        this[cursorName] = input.value.length - input.selectionStart + 1;
      }
    }

    checkValidPrice() {
      if (this.price > this.maxPrice || this.price < this.minPrice) {
        this.inputPrice.classList.add("calculator__input_price_invalid");
        document.querySelector(
          ".calculator__invalid-input-message"
        ).textContent = ERROR_MESSAGE;
      } else {
        this.inputPrice.classList.remove("calculator__input_price_invalid");
        document.querySelector(".calculator__invalid-input-message").textContent =
          "";
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
        this.updateForm();
      } else if (this.term < this.maxTerm) {
        this.term = this.minTerm;
        this.updateForm();
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
      return `${number
      .toString()
      .replace(/(\d)(?=(\d{3})+([^\d]|$))/g, "$1 ")}${unit}`;
    }

    digitsPattern(input) {
      input.value = input.value.replace(/[^0-9 ]/, "");
    }

    transformStringToNumber(str) {
      return +str.replace(/\D/g, "");
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

      this.inputPrice.addEventListener("input", () => this.updatePrice());
      this.inputInitialFee.addEventListener("input", () =>
        this.updateInitialFee()
      );
      this.inputInitialFee.addEventListener("change", () =>
        this.checkValidInitialFee()
      );
      this.inputInitialFee.addEventListener("input", () =>
        this.updateInitialFee()
      );
      this.rangeInitialFee.addEventListener("input", () =>
        this.updateInitialFeePercantage()
      );
      this.inputTerm.addEventListener("input", () =>
        this.updateTerm(this.inputTerm)
      );
      this.rangeTerm.addEventListener("input", () =>
        this.updateTerm(this.rangeTerm)
      );
      this.inputTerm.addEventListener("change", () => this.checkValidTerm());
      this.querySelector(".calculator__step-up").addEventListener("click", () => {
        this.updatePrice(this.priceStep);
      });
      this.querySelector(".calculator__step-down").addEventListener(
        "click",
        () => {
          this.updatePrice(-this.priceStep);
        }
      );
      document
        .querySelector(".offer__button")
        .addEventListener("click", () =>
          makeRequest(
            this.transformValueToString(this.purpose),
            this.transformValueToString(this.price, ["рубль", "рубля", "рублей"]),
            this.transformValueToString(this.initialFee, [
              "рубль",
              "рубля",
              "рублей",
            ]),
            this.transformValueToString(this.term, ["год", "лет", "лет"])
          )
        );
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
      this.querySelector(".checkbox-container").append(
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
      this.querySelector(".checkbox-container").append(
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
      this.querySelector(".checkbox-container").append(
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
    const request = document.querySelector(".request");
    const optionsOpenedClass = "calculator__options_opened";
    const noBottomRadiusClass = "calculator__selected_no-bottom-radius";

    selected.addEventListener("click", toggleOptions);
    options.forEach((item) => {
      item.addEventListener("click", () => selectOption(item));
    });
    window.addEventListener("click", checkClockOutside);

    function hideOptions() {
      optionsContainer.classList.remove(optionsOpenedClass);
      selected.classList.remove(noBottomRadiusClass);
      optionsContainer.addEventListener("transitionend", addVisuallyHiddenClass);
    }

    function addVisuallyHiddenClass() {
      optionsWrap.classList.add("visually-hidden");
      optionsContainer.removeEventListener(
        "transitionend",
        addVisuallyHiddenClass
      );
    }

    function checkClockOutside() {
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
      } else {
        hideOptions();
        changeCalculator();
      }
    }

    function selectOption(option) {
      select.querySelector(".calculator__option_selected") &&
        select
          .querySelector(".calculator__option_selected")
          .classList.remove("calculator__option_selected");

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
        request.classList.add("visually-hidden");
      }
    }
  }

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

}());

//# sourceMappingURL=main.js.map
