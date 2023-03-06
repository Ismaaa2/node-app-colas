const lblNuevoTicket = document.querySelector("#lblNuevoTicket");
const btnCrear = document.querySelector("button");

const socket = io();

socket.on("connect", () => {
  btnCrear.disabled = false;
});

socket.on("ultimo-ticket", (ultimoTicket) => {
  lblNuevoTicket.innerText = ultimoTicket;
});

socket.on("disconnect", () => {
  btnCrear.disabled = true;
});

btnCrear.addEventListener("click", () => {
  socket.emit("siguiente-ticket", null, (ticket) => {
    lblNuevoTicket.innerText = ticket;
  });
});
