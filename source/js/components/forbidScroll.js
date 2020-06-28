export default function forbidScroll(openButton, closeButton) {
  const body = document.querySelector("body");
  const overlay = document.querySelector(".overlay");

  overlay.addEventListener("click", () => {
    event.preventDefault();

    if (existVerticalScroll()) {
      body.classList.remove("body-lock");
      window.scrollTo(0, body.dataset.scrollY);
    }
  });

  body.dataset.scrollY = getBodyScrollTop(); 

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
