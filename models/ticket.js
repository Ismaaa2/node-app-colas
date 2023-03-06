const path = require("path");
const fs = require("fs");

class Ticket {
  constructor(numero, escritorio) {
    this.numero = numero;
    this.escritorio = escritorio;
  }
}

class TicketControll {
  constructor() {
    this.ultimo = 0;
    this.hoy = new Date().getDate();
    this.tickets = [];
    this.utimos4 = [];

    this.init();
  }

  get toJson() {
    return {
      ultimo: this.ultimo,
      hoy: this.hoy,
      tickets: this.tickets,
      utimos4: this.utimos4,
    };
  }

  init() {
    const { hoy = "", tickets, ultimo, utimos4 } = require("../db/data.json");
    if (hoy === this.hoy) {
      this.tickets = tickets;
      this.ultimo = ultimo;
      this.utimos4 = utimos4;
    } else {
      this.guardarDB();
    }
  }

  guardarDB() {
    const dbPath = path.join(__dirname, "../db/data.json");
    fs.writeFileSync(dbPath, JSON.stringify(this.toJson));
  }

  siguiente() {
    this.ultimo += 1;
    this.tickets.push(new Ticket(this.ultimo, null));
    this.guardarDB();
    return `Ticket ${this.ultimo}`;
  }

  atenderTicket(escritorio) {
    if (this.tickets.length === 0) return null;

    const ticket = this.tickets.shift();
    ticket.escritorio = escritorio;

    this.utimos4.unshift(ticket);

    if (this.utimos4.length > 4) this.utimos4.splice(-1, 1);
    this.guardarDB();
    return ticket;
  }
}

module.exports = TicketControll;
