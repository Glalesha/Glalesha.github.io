function close() {
  let popup = document.querySelector('.loginPopup');
  popup.classList.remove('loginPopup__open')

  popup.addEventListener('transitionend', () => {
    popup.style.visibility = "hidden";
  }, { once: true })
}

function closeOnEsc() {
  if (event.key === "Escape") {
    close();
  }
}

document.querySelector('.enter').onclick = function () {
  let popup = document.querySelector('.loginPopup');
  popup.style.visibility = "visible";
  popup.classList.add('loginPopup__open');
  popup.querySelector('.loginPopup__login').focus()

  popup.addEventListener('keydown', closeOnEsc);
  document.querySelector('.close').addEventListener('click', close, { once: true });
}
