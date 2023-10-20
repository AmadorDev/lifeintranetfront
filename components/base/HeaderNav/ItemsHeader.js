import Link from "next/link";
import { FiHeart } from "react-icons/fi";
import { io } from "socket.io-client";
import { apiLogout } from "../../../api/userApi";
import useAuth from "../../../hooks/useAuth";
import ls from "local-storage";
import { useRef, useEffect, useState } from "react";
import { BASE_HOST } from "../../../utils/constants";
import { notificationsApi } from "../../../api/commentApi";
import { FormatTimes } from "../../../utils/timenow";

export function NotificationsH() {
  const [notifications, setNotifications] = useState([]);

  const iconShow = useRef(null);
  async function getNotifications() {
    if (iconShow.current.classList.contains("uk-open")) {
      const resp = await notificationsApi(null);
      if (resp.data) {
        setNotifications(resp.data);
      }
    }
  }

  function ClearText(txt) {
    const regex = /"([^"]*)"/g;
    const result = txt.replace(regex, "$1");
    return result;
  }

  return (
    <>
      <a
        ref={iconShow}
        href="#"
        className="is_icon"
        uk-tooltip="title: Notifications"
        title=""
        aria-expanded="false"
        onClick={getNotifications}
      >
        <FiHeart className="text-red-500" />
        {/* <span>3</span> */}
      </a>

      <div uk-drop="mode: click" className="header_dropdown uk-drop">
        <div className="dropdown_scrollbar" data-simplebar="init">
          <div
            className="simplebar-wrapper"
            style={{ margin: "0px -14px 0px 0px" }}
          >
            <div className="simplebar-height-auto-observer-wrapper">
              <div className="simplebar-height-auto-observer" />
            </div>
            <div className="simplebar-mask">
              <div className="simplebar-offset" style={{ right: 0, bottom: 0 }}>
                <div
                  className="simplebar-content"
                  style={{
                    padding: "0px 14px 0px 0px",
                    height: "auto",
                    overflow: "hidden",
                  }}
                >
                  <div className="drop_headline">
                    <h4>Notificaciones </h4>
                    <div className="btn_action">
                      <a
                        href="#"
                        data-tippy-placement="left"
                        data-tippy=""
                        data-original-title="Notifications"
                      >
                        <ion-icon
                          name="settings-outline"
                          role="img"
                          className="md hydrated"
                          aria-label="settings outline"
                        />
                      </a>
                      <a
                        href="#"
                        data-tippy-placement="left"
                        data-tippy=""
                        data-original-title="Mark as read all"
                      >
                        <ion-icon
                          name="checkbox-outline"
                          role="img"
                          className="md hydrated"
                          aria-label="checkbox outline"
                        />
                      </a>
                    </div>
                  </div>
                  <ul>
                    {/* <li>
                      <a href="#">
                        <div className="drop_avatar">
                          <img
                            src="assets/images/avatars/avatar-1.jpg"
                            alt=""
                          />
                        </div>
                        <span className="drop_icon bg-gradient-primary">
                          <i className="icon-feather-thumbs-up" />
                        </span>
                        <div className="drop_text">
                          <p>
                            <strong>Adrian Mohani</strong> Like Your Comment On
                            Video
                            <span className="text-link">
                              Learn Prototype Faster{" "}
                            </span>
                          </p>
                          <time> 2 hours ago </time>
                        </div>
                      </a>
                    </li> */}
                    {notifications?.map((item, index) => (
                      <li className="not-read mb-2" key={index}>
                        <a>
                          <div className=" ">
                            {" "}
                            <Link
                              href={`/dashboard/profile/${item.user._id}`}
                              className="cursor-pointer"
                            >
                              <img
                                src={
                                  item.user?.profilePicture ||
                                  "assets/images/avatars/avatar-2.jpg"
                                }
                                alt=""
                                className="cursor-pointer notification-image"
                              />
                            </Link>
                          </div>
                          <div className="drop_text ">
                            <div
                              className="notification-content"
                              dangerouslySetInnerHTML={{
                                __html: ClearText(item?.content),
                              }}
                            ></div>
                            <time className="mt-1">
                              {" "}
                              {FormatTimes(item.createdAt)}{" "}
                            </time>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div
              className="simplebar-placeholder"
              style={{ width: 0, height: 0 }}
            />
          </div>
          <div
            className="simplebar-track simplebar-horizontal"
            style={{ visibility: "hidden" }}
          >
            <div
              className="simplebar-scrollbar"
              style={{
                transform: "translate3d(0px, 0px, 0px)",
                visibility: "hidden",
              }}
            />
          </div>
          <div
            className="simplebar-track simplebar-vertical"
            style={{ visibility: "hidden" }}
          >
            <div
              className="simplebar-scrollbar"
              style={{
                transform: "translate3d(0px, 0px, 0px)",
                visibility: "hidden",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export function Account() {
  const { logout, auth, me } = useAuth();
  const socket = useRef();

  useEffect(() => {
    let mounted = false;
    socket.current = io(`${BASE_HOST}`, {
      query: { token: auth.token },
    });
    // socket.current.on("getUsers", (users) => {
    //   let unno = users.filter((f) => f._id !== auth.User_id);
    //   if (!mounted) {
    //     setOnlineUsers(unno);
    //   }
    // });
    // socket.disconnect()
    return () => (mounted = true);
  }, []);

  function darkMode(e) {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.className = "";
      ls.remove("nigthMode");
      return true;
    } else {
      document.documentElement.className = "dark";
      ls.set("nigthMode", true);
      return true;
    }
  }

  async function closeLogout() {
    try {
      const response = await apiLogout(logout, auth?.User_id);
      socket.current.disconnect();
      logout();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="">
      {" "}
      <a href="#">
        <img
          src={me?.profilePicture || `/imgs/profile.png`}
          className="is_avatar avatar_profile"
        />
      </a>
      <div
        uk-drop="mode: click;offset:5"
        className="header_dropdown profile_dropdown"
      >
        <a href="#" className="user">
          <div className="user_avatar">
            {/* <img src={user[0]?.profilePicture} /> */}
          </div>
          <div className="user_name">
            <div> {me?.name} </div>
          </div>
        </a>
        <hr />

        <Link href="/dashboard/profile">
          <a>
            <svg
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                clipRule="evenodd"
              />
            </svg>
            Mi Cuenta
          </a>
        </Link>
        {me?.role === "Administrador" ? (
          <Link href="/dashboard/admin/manage">
            <a>
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
              Gestión
            </a>
          </Link>
        ) : null}

        <a
          href="#"
          id="night-mode"
          className="btn-night-mode"
          onClick={darkMode}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
          Modo oscuro
          <span className="btn-night-mode-switch">
            <span className="uk-switch-button" />
          </span>
        </a>
        <a onClick={closeLogout} className="cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Cerrar sesión
        </a>
      </div>
    </div>
  );
}
