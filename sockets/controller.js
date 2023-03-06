const TicketControll = require("../models/ticket");

const ticket = new TicketControll();

const socketController = (socket) => {
  socket.emit("ultimo-ticket", `Ticket ${ticket.ultimo}`);
  socket.emit("estado-actual", ticket.utimos4);
  socket.emit("tickets-pendientes", ticket.tickets.length);

  socket.on("siguiente-ticket", (payload, callback) => {
    const siguiente = ticket.siguiente();
    callback(siguiente);
    socket.broadcast.emit("tickets-pendientes", ticket.tickets.length);
  });

  socket.on("atender-ticket", ({ escritorio }, callback) => {
    if (!escritorio) {
      return callback({
        ok: false,
        msg: "El escritorio es obligatorio",
      });
    }
    const ticketA = ticket.atenderTicket(escritorio);

    socket.broadcast.emit("estado-actual", ticket.utimos4);
    socket.emit("tickets-pendientes", ticket.tickets.length);
    socket.broadcast.emit("tickets-pendientes", ticket.tickets.length);

    if (!ticketA) {
      callback({
        ok: false,
        msg: "Ya no hay tickets pendientes",
      });
    } else {
      callback({
        ok: true,
        ticketA,
      });
    }
  });
};

module.exports = {
  socketController,
};
