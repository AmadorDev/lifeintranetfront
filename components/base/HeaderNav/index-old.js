import React, { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import { Picker } from "emoji-mart";
import { toast } from "react-toastify";
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
// socketio
import { io } from "socket.io-client";
import { BASE_HOST } from "../../../utils/constants";

// comp
import LastConv from "../../Conversations/LastConv";
import SearchContacts from "../../Conversations/SearchContacts";
import Messagebox from "./Messagebox";
import {
  docsApi,
  imagesApi,
  messagesApi,
  messagesupdApi,
} from "../../../api/messageApi";

// formd
import FormData from "form-data";

import Reloj from "../../utils/Reloj";
import AttendanceC from "../../utils/AttendanceC";
export default function HeaderNav() {
  const { logout, auth, me } = useAuth();
  const { chatbox, chat } = useChat();
  const [user, setUser] = useState([]);
  const [allusers, setAllusers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [convlast, setConvlast] = useState([]);

  const [viewSearch, setViewSearch] = useState(false);

  const [txtsearch, setTxtsearch] = useState("");

  const socket = useRef();
  const scrollRef = useRef();

  // emojis
  const [showEmoji, setShowEmoji] = useState(false);

  // messages read
  const [notreadmsg, setNotReadmsg] = useState(0);
  const [audioplay, setaudioplay] = useState(false);
  // --------chat-------------
  //.
  //.
  //.
  // chatboxx
  const [viewbox, setViewbox] = useState(false);

  // files upload
  const [selectedFile, setSelectedFile] = useState();
  const [loadoc, setloadoc] = useState(false);
  const [loadimg, setloadimg] = useState(false);

  // messages
  const [currentChat, setCurrentChat] = useState(null); //data convid...
  const [receiver, setReceiver] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [lastsender, setlastsender] = useState(null);

  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(() => {
    let mounted = false;
    socket.current = io(`${BASE_HOST}`, {
      query: { token: auth.token },
    });
    socket.current.on("getMessage", (data) => {
      if (!mounted) {
        setlastsender(data.senderId);
        setArrivalMessage({
          sender: data.senderId,
          text: data.text,
          text_type: data.text_type,
          createdAt: Date.now(),
        });
        setaudioplay(true);
      }
    });
    return () => (mounted = true);
  }, []);

  useEffect(() => {
    let mounted = false;
    if (!mounted && arrivalMessage !== null) {
      arrivalMessage &&
        currentChat?.members.includes(arrivalMessage.sender) &&
        setMessages((prev) => [...prev, arrivalMessage]);
    }
    return () => {
      mounted = true;
      setArrivalMessage(null);
    };
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    let mounted = false;
    if (!mounted) {
      if (audioplay) {
        try {
          document.getElementById("buttonPlay").click();
        } catch (error) {}
      }
    }
    return () => (mounted = true);
  }, [audioplay]);

  function sonidoplay() {
    const audioEl = document.getElementsByClassName("audio-element")[0];
    audioEl.play();
    setaudioplay(false);
  }

  useEffect(() => {
    let mounted = false;
    // socket.current.emit("addUser", auth?.User_id);
    socket.current.on("getUsers", (users) => {
      let unno = users.filter((f) => f._id !== auth.User_id);
      if (!mounted) {
        setOnlineUsers(unno);
      }
    });
    // socket.disconnect()
    return () => (mounted = true);
  }, []);

  // para mantener chatbox en todas las pantallas
  useMemo(() => {
    let mounted = false;
    if (!mounted) {
      if (chat !== undefined) {
        (async () => {
          const resp = await messagesApi(chat, auth?.User_id, logout);
          const rchat = await getDetailsApi(chat, logout);
          setReceiver(resp?.current);
          setMessages(resp?.data);
          setCurrentChat(rchat?.data);
          setViewbox(true);
        })();
      }
    }
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

  // chat
  useEffect(() => {
    let mounted = false;
    if (!mounted) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    return () => (mounted = true);
  }, [messages, viewbox]);

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

  // chat-------------
  // al hacer click en listado de convs
  // trae en el primer arreglo el tipo d=n

  async function chatboxAccion(data) {
    // si es tipo de conv
    if (data[0] === "d") {
      const resp = await messagesApi(data[1], auth?.User_id, logout);
      const rchat = await getDetailsApi(`${data[1]}`, logout);
      const upmessage = await messagesupdApi(data[2], logout);

      chatbox(data[1]);
      setReceiver(resp?.current);
      setMessages(resp?.data);
      setCurrentChat(rchat?.data);
      setViewbox(true);
    } else {
      const addconv = await covxDsUser(user._id, data[1], logout);
      const resp = await messagesApi(addconv?.data._id, auth?.User_id, logout);
      const rchat = await getDetailsApi(addconv?.data._id, logout);
      setReceiver(resp?.current);
      setMessages(resp?.data);
      setCurrentChat(rchat?.data);

      chatbox(addconv?.data._id);
      setTxtsearch("");
      setViewbox(true);
    }
  }
  function boxClose() {
    chatbox(undefined);
    setViewbox(false);
    setReceiver([]);
  }

  async function handleKeyDown(e) {
    if (e.key === "Enter") {
      console.log("entr");
      handleSubmit(e);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage) {
      const message = {
        sender: auth.User_id,
        text: newMessage,
        text_type: "text",
        conversationId: currentChat._id,
      };

      socket.current.emit("sendMessage", {
        senderId: auth.User_id,
        receiverId: receiver._id,
        text: newMessage,
        text_type: "text",
      });

      try {
        const res = await addMessageApi(message, logout);

        setMessages([...messages, res.data]);
        setNewMessage("");
      } catch (err) {}
    } else {
      document.getElementById("msgInput").focus();
    }
  };

  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emojis = String.fromCodePoint(...codesArray);
    setNewMessage(newMessage + emojis);
    setShowEmoji(false);
  };

  function uploadFiles() {
    setSelectedFile([]);
    document.getElementById("selectImage").click();
  }

  function uploadDocs() {
    document.getElementById("selectDocs").click();
  }

  const typeAceptImage = ["image/jpg", "image/jpeg", "image/png"];
  const changeHandlerFile = async (event) => {
    const image = event.target.files[0];
    // setSelectedFile(event.target.files[0]);
    console.log("imagen seleccionada---", selectedFile);
    console.log("imagen seleccionada event---", event.target.files[0]);
    if (typeAceptImage.includes(image?.type)) {
      console.log("ssssss", process.env.IMG_SIZE);
      if (image.size <= process.env.IMG_SIZE) {
        let confirmAction = confirm("Esta seguro de enviar la imagen?");
        if (confirmAction) {
          setloadimg(true);
          const formData = new FormData();
          formData.append("imgs", image);
          const resp = await imagesApi(formData, logout);
          setloadimg(false);
          const typeImage = image.type;
          let typemines = typeImage.replace(/[^a-zA-Z ]/g, "");
          const message = {
            sender: auth.User_id,
            text: resp.data,
            text_type: typemines,
            conversationId: currentChat._id,
          };

          socket.current.emit("sendMessage", {
            senderId: auth.User_id,
            receiverId: receiver._id,
            text: resp.data,
            text_type: typemines,
          });

          try {
            const res = await addMessageApi(message, logout);

            setMessages([...messages, res.data]);
            setNewMessage("");
            document.getElementById("selectImage").value = "";
          } catch (err) {}
        } else {
          document.getElementById("selectImage").value = "";
          toast.info("Envio cancelado");
        }
      } else {
        toast.error("Peso max 1.5MB");
        document.getElementById("selectImage").value = "";
      }
    } else {
      document.getElementById("selectImage").value = "";
      toast.error(`Archivos válidos: ${typeAceptImage}`);
    }
  };

  const typeAceptDocs = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ];
  const changeHandlerDocs = async (event) => {
    const docs = event.target.files[0];
    console.log("docs", docs);

    if (typeAceptDocs.includes(docs?.type)) {
      if (docs.size <= process.env.DOCS_SIZE) {
        let confirmAction = confirm("Esta seguro de enviar el Doc?");
        if (confirmAction) {
          const formData = new FormData();
          formData.append("docs", docs);
          setloadoc(true);
          const resp = await docsApi(formData, logout);
          setloadoc(false);
          const typeDocs = docs.type;
          let typemines = typeDocs.replace(/[^a-zA-Z ]/g, "");
          const message = {
            sender: auth.User_id,
            text: resp.data,
            text_type: typemines,
            conversationId: currentChat._id,
          };
          socket.current.emit("sendMessage", {
            senderId: auth.User_id,
            receiverId: receiver._id,
            text: resp.data,
            text_type: typemines,
          });
          try {
            const res = await addMessageApi(message, logout);
            setMessages([...messages, res.data]);
            setNewMessage("");
            document.getElementById("selectDocs").value = "";
          } catch (err) {}
        } else {
          document.getElementById("selectDocs").value = "";
          toast.info("Envio cancelado");
        }
      } else {
        toast.error("Peso max 1.5MB");
        document.getElementById("selectDocs").value = "";
      }
    } else {
      document.getElementById("selectDocs").value = "";
      toast.error(`Archivos válidos: Pdf, Word, Excel, PowerPoint`);
    }
  };
  return (
    <>
      {/* Header */}
      <header>
        <button
          id="buttonPlay"
          onClick={sonidoplay}
          style={{ display: "none" }}
        ></button>

        <audio className="audio-element">
          <source src="/audio/message.mp3"></source>
        </audio>
        <div className="header_wrap">
          <div className="header_inner mcontainer">
            <div className="left_side">
              <span
                className="slide_menu"
                uk-toggle="target: #wrapper ; cls: is-collapse is-active"
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
                    <img src="/assets/images/logo.png" />
                    <img
                      src="/assets/images/logo-mobile.png"
                      className="logo_mobile"
                    />
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
                className="form-control"
                placeholder="Search for Friends , Videos and more.."
                autoComplete="off"
              />
              <div uk-drop="mode: click" className="header_search_dropdown">
                <h4 className="search_title"> Recently </h4>
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
                </ul>
              </div>
            </div>
            <div className="right_side">
              <div className="header_widgets">
                <a href="#" className="">
                  <Reloj></Reloj>
                </a>
                <div uk-drop="mode: click" className="header_dropdown mt-3">
                  <AttendanceC logout={logout}></AttendanceC>
                </div>
                {/* Message */}
                <a className="is_icon poiter" uk-tooltip="title: Mensajes">
                  <svg
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span
                    className={notreadmsg === 0 ? "bgIconMsg" : "bgIconMsgR"}
                  >
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
                        -
                        <span
                          title="contactos"
                          className="poiter"
                          onClick={() => setViewSearch(true)}
                        >
                          Contactos
                        </span>
                      </h5>
                    </div>

                    <ul>
                      {!viewSearch ? (
                        convlast?.map((c) => (
                          <LastConv
                            c={c}
                            key={c._id}
                            auth={auth}
                            chatboxAccion={chatboxAccion}
                          />
                        ))
                      ) : (
                        <>
                          {" "}
                          <input
                            type="text"
                            className="uk-input"
                            value={txtsearch}
                            onChange={(e) => setTxtsearch(e.target.value)}
                            placeholder="Buscar contacto"
                          />
                          <div className="contact-list my-2 ml-1">
                            {/* empleados conectados */}
                            {allusers?.map((em) => (
                              <SearchContacts
                                key={em._id}
                                users={em}
                                auth={auth}
                                chatboxAccion={chatboxAccion}
                              ></SearchContacts>
                            ))}
                          </div>
                        </>
                      )}
                    </ul>
                  </div>
                  {/* <a href="#" className="see-all">
                    See all in Messages
                  </a> */}
                </div>
                <a href="#">
                  <img src={me?.profilePicture} className="is_avatar" />
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
                    Night mode
                    <span className="btn-night-mode-switch">
                      <span className="uk-switch-button" />
                    </span>
                  </a>
                  <a onClick={closeLogout} className="poiter">
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
                    Log Out
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/*
      *
      *
      *
      *
      =======chatbox======
      *
      *
      *
      *
      */}

      {viewbox ? (
        <div className="startbox">
          <div className="messages-container">
            <div className="messages-container-inner">
              <div className="message-content">
                <div className="messages-headline">
                  <h4> {receiver?.name}</h4>
                  <a className="message-action text-red-500">
                    <span
                      className="md:inline poiter text-red-500"
                      onClick={boxClose}
                    >
                      {" "}
                      Cerrar
                    </span>
                  </a>
                </div>
                <div className="message-content-scrolbar" data-simplebar>
                  {/* Message Content Inner */}
                  <div className="message-content-inner">
                    {messages?.map((m, index) => (
                      <div ref={scrollRef} key={index}>
                        <Messagebox
                          key={index}
                          message={m}
                          receiver={receiver}
                          own={m.sender === auth?.User_id}
                          sender={user}
                        />
                      </div>
                    ))}
                  </div>
                  {/* footer */}
                  <div className="message-reply footerbox">
                    <textarea
                      cols={1}
                      rows={1}
                      id="msgInput"
                      className="txtSend"
                      placeholder="Escribir mensaje"
                      onChange={(e) => setNewMessage(e.target.value)}
                      value={newMessage}
                      onKeyDown={handleKeyDown}
                    />

                    <button onClick={handleSubmit} className="btnsends">
                      <img src="/chatf/msg/send.svg" alt="" />
                    </button>

                    <button
                      onClick={() => setShowEmoji(true)}
                      className="btnsends"
                    >
                      <img src="/chatf/msg/emoji.svg" alt="" />
                    </button>

                    {loadimg ? (
                      <div className="lds-ring">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                    ) : (
                      <input
                        className="customfileinput customimgs"
                        id="selectImage"
                        type="file"
                        onChange={changeHandlerFile}
                      />
                    )}
                    {loadoc ? (
                      <div className="lds-ring ml-1">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                    ) : (
                      <input
                        className="customfileinput customfileinput-docs"
                        id="selectDocs"
                        type="file"
                        onChange={changeHandlerDocs}
                      />
                    )}
                  </div>
                  {/* footer */}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {showEmoji ? <Picker onSelect={addEmoji} /> : null}
    </>
  );
}
