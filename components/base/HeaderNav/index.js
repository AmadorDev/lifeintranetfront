import React, { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";

import { io } from "socket.io-client";
import { BASE_HOST } from "../../../utils/constants";

import ls from "local-storage";

import useAuth from "../../../hooks/useAuth";
import useChat from "../../../hooks/useChat";

import {
  apiMeCall,
  apiLogout,
  apiGetUsers,
  apiUserSearch,
} from "../../../api/userApi";

import {
  addMessageApi,
  convMeApi,
  getDetailsApi,
  covxDsUser,
} from "../../../api/convApi";

// comp
import LastConv from "../../Conversations/LastConv";
import SearchContacts from "../../Conversations/SearchContacts";

import Reloj from "../../utils/Reloj";
import AttendanceC from "../../utils/AttendanceC";
import BoxChat from "../../Chat/BoxChat";

import { useAppContext } from "../../../providers/AppProvider";
import { Account, NotificationsH } from "./ItemsHeader";

export default function HeaderNav() {
  const { box, dispatch } = useAppContext();

  const { logout, auth, me } = useAuth();
  const { chatbox, chat } = useChat();
  const [user, setUser] = useState([]);
  const [allusers, setAllusers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [convlast, setConvlast] = useState([]);

  const [viewSearch, setViewSearch] = useState(false);

  const [txtsearch, setTxtsearch] = useState("");

  const socket = useRef();

  // messages read
  const [notreadmsg, setNotReadmsg] = useState(0);

  // messages
  const [currentChat, setCurrentChat] = useState(null); //data convid...
  const [receiver, setReceiver] = useState([]);
  const [lastsender, setlastsender] = useState(null);

  const [arrivalMessage, setArrivalMessage] = useState(null);

  // -- socket para contacts online
  useEffect(() => {
    let mounted = false;
    socket.current = io(`${BASE_HOST}`, {
      query: { token: auth.token },
    });
    socket.current.on("getUsers", (users) => {
      let unno = users.filter((f) => f._id !== auth.User_id);
      if (!mounted) {
        setOnlineUsers(unno);
      }
    });
    // socket.disconnect()
    return () => (mounted = true);
  }, []);

  useEffect(() => {
    let mounted = false;
    let nMode = ls.get("nigthMode");
    if (nMode) {
      if (!mounted) {
        document.documentElement.className = "dark";
      }
    }

    return () => (mounted = true);
  }, []);

  useMemo(() => {
    let mounted = false;
    if (!mounted) {
      getPerfil();
    }
    return () => (mounted = true);
  }, [auth]);

  useMemo(() => {
    let mounted = false;
    if (!mounted) {
      getUsers();
    }
    return () => (mounted = true);
  }, [txtsearch, viewSearch]);

  useMemo(() => {
    let mounted = false;
    if (!mounted) {
      getConvMe();
    }
    return () => (mounted = true);
  }, [auth, onlineUsers, currentChat]);

  useMemo(() => {
    let mounted = false;
    if (!mounted) {
      if (Object.keys(receiver).length > 0) {
        if (receiver?._id !== lastsender) {
          getConvMe();
        }
      } else {
        getConvMe();
      }
    }
    return () => {
      mounted = true;
      setlastsender(null);
    };
  }, [arrivalMessage]);

  async function getConvMe() {
    try {
      let contamessage = 0;
      const convts = [];
      const resp = await convMeApi(auth?.User_id, logout);
      const newUser = resp?.data.filter((f) => {
        if (!f.read) {
          contamessage = contamessage + 1;
        }
        if (onlineUsers.some((i) => i._id == f.sender._id)) {
          f.online = 1;
        } else {
          f.online = 0;
        }
        convts.push(f);
      });

      setConvlast(convts);
      setNotReadmsg(contamessage);
    } catch (error) {}
  }

  async function getUsers() {
    if (txtsearch !== "") {
      const res = await apiUserSearch(logout, txtsearch);
      let data = res?.data.filter((items) => items._id !== auth?.User_id);
      const newUser = data?.filter((f) => {
        if (onlineUsers.some((i) => i._id === f._id)) {
          f.online = 1;
        } else {
          f.online = 0;
        }
        return f;
      });
      setAllusers(newUser);
    }
  }

  async function getPerfil() {
    // try {
    //   const resp = await apiMeCall(logout, auth?.User_id);
    //   setUser(resp?.data);
    // } catch (error) {}

    setUser(me);
  }

  async function closeLogout() {
    try {
      const response = await apiLogout(logout, auth?.User_id);
      socket.current.disconnect();
      logout();
    } catch (error) {}
  }

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

  return (
    <>
      <header>
        <div className="header_wrap">
          <div className="header_inner mcontainer">
            <div className="left_side">
              <span
                className="slide_menu"
                uk-toggle="target: #wrapper ; cls: is-active"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width={24}
                  height={24}
                >
                  <path
                    d="M3 4h18v2H3V4zm0 7h12v2H3v-2zm0 7h18v2H3v-2z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <div id="logo">
                <Link href="/dashboard">
                  <a>
                    <img src="/imgs/life.svg" />
                    <img src="/imgs/life.svg" className="logo_mobile" />
                  </a>
                </Link>
              </div>
            </div>
            {/* search icon for mobile */}
            <div
              className="header-search-icon"
              uk-toggle="target: #wrapper ; cls: show-searchbox"
            ></div>
            <div className="header_search">
              <i className="uil-search-alt" />
              <input
                type="text"
                className="input-c uk-input"
                value={txtsearch}
                onChange={(e) => setTxtsearch(e.target.value)}
                placeholder="Buscar personas"
                autoComplete="off"
              />
              <div uk-drop="mode: click" className="header_search_dropdown">
                {/* <input
                            type="text"
                            className="uk-input"
                            value={txtsearch}
                            onChange={(e) => setTxtsearch(e.target.value)}
                            placeholder="Buscar contacto"
                          /> */}
                <div className="contact-list my-2 ml-1">
                  {/* empleados conectados */}
                  {allusers?.map((em) => (
                    <SearchContacts
                      key={em._id}
                      users={em}
                      auth={auth}
                    ></SearchContacts>
                  ))}
                </div>
                {/* <h4 className="search_title"> Recently </h4>
                <ul>
                  <li>
                    <a href="#">
                      <img
                        src="/assets/images/avatars/avatar-1.jpg"
                        className="list-avatar"
                      />
                      <div className="list-name"> Erica Jones </div>
                    </a>
                  </li>
                </ul> */}
              </div>
            </div>
            <div className="right_side">
              <div className="header_widgets">
                <a href="#" className="">
                  <Reloj></Reloj>
                </a>
                {/* Message */}
                <a className="is_icon poiter" uk-tooltip="title: Mensajes">
                  <img src="/imgs/coment.svg" width="23"></img>
                  <span className="bgIconMsg">
                    {notreadmsg ? notreadmsg : 0}
                  </span>
                </a>
                <div
                  uk-drop="mode: click"
                  className="header_dropdown is_message"
                >
                  <div className="dropdown_scrollbar" data-simplebar>
                    <div className="drop_headline">
                      <h5 className="font-normal">
                        <span
                          title="mensajes"
                          className="poiter"
                          onClick={() => setViewSearch(false)}
                        >
                          Mensajes
                        </span>
                        {/* -
                        <span
                          title="contactos"
                          className="poiter"
                          onClick={() => setViewSearch(true)}
                        >
                          Contactos
                        </span> */}
                      </h5>
                    </div>

                    <ul>
                      {
                        !viewSearch
                          ? convlast?.map((c) => (
                              <LastConv c={c} key={c._id} auth={auth} />
                            ))
                          : null
                        // <>
                        //   {" "}
                        //   <input
                        //     type="text"
                        //     className="uk-input"
                        //     value={txtsearch}
                        //     onChange={(e) => setTxtsearch(e.target.value)}
                        //     placeholder="Buscar contacto"
                        //   />
                        //   <div className="contact-list my-2 ml-1">
                        //     {/* empleados conectados */}
                        //     {allusers?.map((em) => (
                        //       <SearchContacts
                        //         key={em._id}
                        //         users={em}
                        //         auth={auth}
                        //       ></SearchContacts>
                        //     ))}
                        //   </div>
                        // </>
                      }
                    </ul>
                  </div>
                  {/* <a href="#" className="see-all">
                    See all in Messages
                  </a> */}
                </div>

                <NotificationsH></NotificationsH>
                <div className="block md:hidden">
                  <Account></Account>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* =======chatbox====== */}
      {box.ventana ? (
        <BoxChat
        // receiver={receiver}
        // setReceiver={setReceiver}
        // data={modosAccess}
        // setVentana={setVentana}
        ></BoxChat>
      ) : null}
    </>
  );
}
