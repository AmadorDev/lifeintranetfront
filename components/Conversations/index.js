import React, { useEffect, useState } from "react";

export default function index({ conv, currentUser }) {
  const [contact, setContact] = useState(null);

  // useEffect(() => {
  //   const idContct = conv.members.find((m) => m !== currentUser._id);

  //   const getUser = async () => {
  //     try {
  //       const res = await axios("/users?userId=" + friendId);
  //       setUser(res.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   getUser();
  // }, [currentUser, conversation]);
  return (
    <>
      <div className="messages-inbox">
        <div className="messages-headline">
          <div className="input-with-icon" hidden>
            <input id="autocomplete-input" type="text" placeholder="Search" />
            <i className="icon-material-outline-search" />
          </div>
          <h2 className="text-2xl font-semibold">Chats</h2>
          <span className="absolute icon-feather-edit mr-4 text-xl uk-position-center-right cursor-pointer" />
        </div>
        <div className="messages-inbox-inner" data-simplebar>
          <ul>
            {conv.map((cv) => (
              <li key={cv._id}>
                <a href="#">
                  <div className="message-avatar">
                    <i className="status-icon status-online" />
                    <img src="/assets/images/avatars/avatar-2.jpg" />
                  </div>
                  <div className="message-by">
                    <div className="message-by-headline">
                      <h5>Jonathan Madano</h5>
                      <span>2 days ago</span>
                    </div>
                    <p>Nisl ut aliquip ex ea commodo consequa</p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
