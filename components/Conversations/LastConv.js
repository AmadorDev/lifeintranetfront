import Link from "next/link";
import React from "react";
import { format, register } from "timeago.js";
import { useAppContext } from "../../providers/AppProvider";

let sss = function (number, index, totalSec) {
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
register("es_PE", sss);
export default function LastConv({ c, auth }) {
  const { dispatch } = useAppContext();
  function setData() {
    // dispachet box
    dispatch({
      type: "ADD_BOX",
      value: {
        receiver: c.sender,
        data: ["d", c.conversationId, c._id],
        ventana: true,
      },
    });
  }
  return (
    <li
      key={c._id}
      className={c.read ? "poiter" : "un-read poiter"}
      onClick={() => setData()}
    >
      <a>
        <div className={c.online ? "drop_avatar status-online" : "drop_avatar"}>
          <img src={c.sender.profilePicture} className="avatarImg" />
        </div>
        <div className="drop_text">
          <strong> {c.sender.name}</strong>{" "}
          <time>{format(c.createdAt, "es_PE")}</time>
          {c.text_type === "text" ? (
            <p> {c.text}</p>
          ) : (
            <p>
              <img
                src={`/chatf/${c.text_type}.svg`}
                alt=""
                className="iconViechatLast"
              />
            </p>
          )}
        </div>
      </a>
    </li>

    //</Link>
  );
}
