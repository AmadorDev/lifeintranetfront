import Link from "next/link";
import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { covxDsUser } from "../../api/convApi";
export default function ListContacts({ contacts }) {
  const { auth, logout } = useAuth();

  return (
    <>
      {contacts.map((items) => (
        <Link
          key={items._id}
          href={{
            pathname: "/dashboard/messages",
            query: {
              receiverId: items._id,
              senderId: `${auth?.User_id}`,
            },
          }}
        >
          <a>
            <div className="contact-avatar">
              <img src={items.profilePicture} />
              <span className="user_status status_online" />
            </div>
            <div className="contact-username">{items.name}</div>
          </a>
        </Link>
      ))}
    </>
  );
}
