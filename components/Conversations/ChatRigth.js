import React from "react";
import Link from "next/link";
import ListContacts from "../dashbord/ListContacts";
export default function ChatRigth({ contacts, auth }) {
  return (
    <>
      {/* open chat box */}
      <div uk-toggle="target: #offcanvas-chat" className="start-chat">
        <svg
          className="h-7 w-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
          />
        </svg>
      </div>
      <div id="offcanvas-chat" uk-offcanvas="flip: true; overlay: true">
        <div className="uk-offcanvas-bar bg-white p-0 w-full lg:w-80 shadow-2xl">
          <div className="relative pt-5 px-4">
            <h3 className="text-2xl font-bold mb-2"> Chats </h3>
            <div className="absolute right-3 top-4 flex items-center">
              <button
                className="uk-offcanvas-close  px-2 -mt-1 relative rounded-full inset-0 lg:hidden blcok"
                type="button"
                data-uk-close
              />
              <a
                href="#"
                uk-toggle="target: #search;animation: uk-animation-slide-top-small"
              >
                <ion-icon
                  name="search"
                  className="text-xl hover:bg-gray-100 p-1 rounded-full"
                />
              </a>
              <a href="#">
                <ion-icon
                  name="settings-outline"
                  className="text-xl hover:bg-gray-100 p-1 rounded-full"
                />
              </a>
              <a href="#">
                <ion-icon
                  name="ellipsis-vertical"
                  className="text-xl hover:bg-gray-100 p-1 rounded-full"
                />
              </a>
              <div
                className="bg-white w-56 shadow-md mx-auto p-2 mt-12 rounded-md text-gray-500 hidden border border-gray-100 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
                uk-drop="mode: click;pos: bottom-right;animation: uk-animation-slide-bottom-small; offset:5"
              >
                <ul className="space-y-1">
                  <li>
                    <a
                      href="#"
                      className="flex items-center px-3 py-2 hover:bg-gray-100 hover:text-gray-800 rounded-md dark:hover:bg-gray-800"
                    >
                      <ion-icon
                        name="checkbox-outline"
                        className="pr-2 text-xl"
                      />
                      Mark all as read
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center px-3 py-2 hover:bg-gray-100 hover:text-gray-800 rounded-md dark:hover:bg-gray-800"
                    >
                      <ion-icon
                        name="settings-outline"
                        className="pr-2 text-xl"
                      />
                      Chat setting
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center px-3 py-2 hover:bg-gray-100 hover:text-gray-800 rounded-md dark:hover:bg-gray-800"
                    >
                      <ion-icon
                        name="notifications-off-outline"
                        className="pr-2 text-lg"
                      />
                      Disable notifications
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center px-3 py-2 hover:bg-gray-100 hover:text-gray-800 rounded-md dark:hover:bg-gray-800"
                    >
                      <ion-icon name="star-outline" className="pr-2 text-xl" />
                      Create a group chat
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div
            className="absolute bg-white z-10 w-full -mt-5 lg:-mt-2 transform translate-y-1.5 py-2 border-b items-center flex"
            id="search"
            hidden
          >
            <input type="text" placeholder="Search.." className="flex-1" />
            <ion-icon
              name="close-outline"
              className="text-2xl hover:bg-gray-100 p-1 rounded-full mr-4 cursor-pointer"
              uk-toggle="target: #search;animation: uk-animation-slide-top-small"
            />
          </div>
          <nav className="responsive-nav border-b extanded mb-2 -mt-2">
            <ul uk-switcher="connect: #chats-tab; animation: uk-animation-fade">
              <li className="uk-active">
                <a className="active" href="#0">
                  Contactos
                </a>
              </li>
            </ul>
          </nav>
          <div className="contact-list px-2 uk-switcher" id="chats-tab">
            <div className="p-1">
              {contacts?.map((items) => (
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
        </div>
      </div>
    </>
  );
}
