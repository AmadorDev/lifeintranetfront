import { format, register } from "timeago.js";

const configs = function (number, index, totalSec) {
  return [
    ["justo ahora", "right now"],
    ["hace %s segundos", "in %s seconds"],
    ["hace 1 minuto", "in 1 minute"],
    ["hace %s minutos ", "in %s minutes"],
    ["hace 1 hora", "in 1 hour"],
    ["hace %s horas", "in %s hours"],
    ["hace 1 dia", "in 1 day"],
    ["hace %s dias ", "in %s days"],
    ["hace 1 semana", "in 1 week"],
    ["hace %s semanas", "in %s weeks"],
    ["hace 1 mes", "in 1 month"],
    ["hace %s meses", "in %s months"],
    ["hace 1 año", "in 1 year"],
    ["hace %s años", "in %s years"],
  ][index];
};

export function FormatTimes(date) {
  register("es_PE", configs);
  return format(date, "es_PE");
}
