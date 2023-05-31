import React from "react";
import Link from "next/link";
import { useAppContext } from "../../providers/AppProvider";
export default function SearchContacts({
  users,
}) {
  const { dispatch } = useAppContext();
  function setData() {
    // dispachet box
    dispatch({
      type: "ADD_BOX",
      value: {
        receiver: users,
        data: ["n"],
        ventana: true,
      },
    });
  }
  return (
    <a onClick={() => setData()} className="poiter" key={users._id}>
      <div className="contact-avatar">
        <img src={users.profilePicture} />
        <span
          className={users.online ? "user_status status_online" : "user_status"}
        />
      </div>
      <div className="contact-username">{users.name} {users.surnames}</div>
    </a>
  );
}
