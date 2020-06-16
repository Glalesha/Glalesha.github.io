// // import Popup from "./popup";

// // const popup = document.querySelector(".thanks-popup");
// // const closeButton = document.querySelector(".thanks-popup__close");
// // const overlay = document.querySelector(".overlay");

// // export default class ThanksPopup extends Popup {
// //   constructor() {
// //     this.popup = popup;
// //     this.closeButton = closeButton;
// //     this.overlay = overlay;
// //   }
// // }

// export default function thanksPopup() {
//   const popup = document.querySelector(".thanks-popup");
//   const closeButton = document.querySelector(".thanks-popup__close");
//   const overlay = document.querySelector(".overlay");

//   enterButton.addEventListener("click", openPopup);

//   function close() {
//     overlay.style.display = "none";
//     popup.classList.remove("login-popup_open");

//     popup.addEventListener(
//       "transitionend",
//       () => {
//         popup.style.visibility = "hidden";
//         login.value = "";
//         password.value = "";
//       },
//       { once: true }
//     );
//   }

//   function closeOnEsc() {
//     if (event.key === "Escape") {
//       close();
//     }
//   }

//   function openPopup() {
//     popup.style.visibility = "visible";
//     popup.classList.add("request-popup_open");

//     overlay.style.height = `${Math.max(
//       document.body.scrollHeight,
//       document.body.offsetHeight,
//       document.documentElement.clientHeight,
//       document.documentElement.scrollHeight,
//       document.documentElement.offsetHeight
//     )}px`;
//     overlay.style.display = "block";
//     overlay.onclick = function () {
//       close();
//     };

//     popup.addEventListener("keydown", closeOnEsc);
//     closeButton.addEventListener("click", close, { once: true });
//   }
// }
