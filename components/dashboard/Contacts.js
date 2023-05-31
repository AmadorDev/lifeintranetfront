import Link from "next/link";
import React, { useEffect, useState } from "react";
import { apiGetUsers } from "../../api/userApi";
import useAuth from "../../hooks/useAuth";

export default function Contacts() {
  const { logout, auth } = useAuth();
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    const res = await apiGetUsers(logout);
    setContacts(res?.data.filter((items) => items._id !== auth?.User_id));
  }
  return (
    <>
      <div uk-sticky="offset:80">
        <nav className="responsive-nav border-b extanded mb-2 -mt-2">
          <ul uk-switcher="connect: #group-details; animation: uk-animation-fade">
            <li className="uk-active">
              <a className="active" href="#0">
                Contactos <span> {contacts.length} </span>
              </a>
            </li>
            {/* <li>
              <a href="#0">Groups</a>
            </li> */}
          </ul>
        </nav>
        <div className="contact-list">
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
        </div>
      </div>
    </>
  );
}
