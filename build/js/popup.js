function close() {
  document.querySelector('.overlay').style.display = "none";
  let popup = document.querySelector('.loginPopup');
  popup.classList.remove('loginPopup_open')

  popup.addEventListener('transitionend', () => {
    popup.style.visibility = "hidden";
    popup.querySelector('.login').value = "";
    popup.querySelector('.password__input').value = "";
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
  popup.classList.add('loginPopup_open');
  popup.querySelector('.login').focus();
  let overlay = document.querySelector('.overlay');
  overlay.style.height = `${Math.max(document.body.scrollHeight, document.body.offsetHeight,
    document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight)}px`;
  overlay.style.display = "block";
  overlay.onclick = function () {
    close();
  }

  popup.addEventListener('keydown', closeOnEsc);
  document.querySelector('.close').addEventListener('click', close, { once: true });
}

document.querySelector('.password__show').onmousedown = function () {
  this.addEventListener("mouseup", notPressingDown, { once: true });
  this.addEventListener("mouseleave", notPressingDown, { once: true });
  this.addEventListener("touchend", notPressingDown, { once: true });
  this.classList.add('password__show_hold');

  function notPressingDown() {
    document.querySelector('.password__input').setAttribute('type', 'password');
    this.classList.remove('password__show_hold');
  }

  document.querySelector('.password__input').setAttribute('type', 'text');
}

document.querySelector('.loginForm').onsubmit = function () {
  event.preventDefault();
  localStorage.setItem('login', document.querySelector('.login').value);
  localStorage.setItem('password', document.querySelector('.password__input').value);
  document.querySelector('.login').value = ""
  document.querySelector('.password__input').value = ""
}
