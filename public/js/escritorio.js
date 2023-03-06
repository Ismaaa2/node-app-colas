const lblEscritorio = document.querySelector("h1");
const btnAtender = document.querySelector("button");
const lblTicket = document.querySelector("small");
const divAlert = document.querySelector(".alert");
const lblPendientes = document.querySelector("#lblPendientes");

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has("escritorio")) {
  window.location = "index.html";
  throw new Error("El escritorio es obligatorio");
}

const escritorio = searchParams.get("escritorio");
lblEscritorio.innerText = escritorio;
divAlert.style.display = "none";

const socket = io();

socket.on("connect", () => {
  btnAtender.disabled = false;
});

socket.on("disconnect", () => {
  btnAtender.disabled = true;
});

socket.on("tickets-pendientes", (pendientes) => {
  console.log(pendientes);
  if (pendientes === 0) {
    lblPendientes.style.display = "none";
  } else {
    lblPendientes.style.display = "";
    lblPendientes.innerHTML = pendientes;
  }
});

socket.on("ultimo-ticket", (ultimoTicket) => {
  //lblNuevoTicket.innerText = ultimoTicket;
});

btnAtender.addEventListener("click", () => {
  socket.emit("atender-ticket", { escritorio }, ({ ok, ticketA, msg }) => {
    if (!ok) {
      lblTicket.innerText = "Nadie";
      return (divAlert.style.display = "");
    }

    lblTicket.innerText = `Ticket ${ticketA.numero}`;
  });
  //   socket.emit("siguiente-ticket", null, (ticket) => {
  //     lblNuevoTicket.innerText = ticket;
  //   });
});
