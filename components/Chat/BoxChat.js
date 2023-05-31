import React, { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";

import { io } from "socket.io-client";

import { Picker } from "emoji-mart";
import FormData from "form-data";

import { BASE_HOST } from "../../utils/constants";
import useAuth from "../../hooks/useAuth";
import useChat from "../../hooks/useChat";
import {
  docsApi,
  imagesApi,
  messagesApi,
  messagesupdApi,
} from "../../api/messageApi";
import { addMessageApi, covxDsUser, getDetailsApi } from "../../api/convApi";

import MessageItem from "./MessageItem";
import { toast } from "react-hot-toast";

import { useAppContext } from "../../providers/AppProvider";

export default function BoxChat() {
  const { box, convId, dispatch } = useAppContext();

  const { logout, auth, me } = useAuth();
  const { chatbox, chat } = useChat();

  // chatboxx
  const [showBox, setShowBox] = useState(false);

  // loading------
  const [loadimg, setloadimg] = useState(false);
  const [loadoc, setloadoc] = useState(false);

  // ----messages-----
  const [currentChat, setCurrentChat] = useState(null); //data convid...
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [lastsender, setlastsender] = useState(null);

  const [arrivalMessage, setArrivalMessage] = useState(null);

  // emojis
  const [showEmoji, setShowEmoji] = useState(false);

  // messages read
  const [notreadmsg, setNotReadmsg] = useState(0);
  const [audioplay, setaudioplay] = useState(false);

  // sockets
  const socket = useRef();
  const scrollRef = useRef();

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

  // iniciar--------
  useEffect(() => {
    let isMounted = false;
    if (!isMounted) {
      chatboxAccion(box?.data);
    }
    return () => {
      isMounted = true;
    };
  }, [box?.receiver]);

  // si el chat existe verificamos el idconversacion para abrirla
  // useMemo(() => {
  //   let mounted = false;
  //   if (!mounted) {
  //     if (convId !== "") {
  //       (async () => {
  //         console.log("-----convvvvvv");
  //         const resp = await messagesApi(convId, auth?.User_id, logout);
  //         const rchat = await getDetailsApi(convId, logout);
  //         setReceiver(resp?.current);
  //         setMessages(resp?.data);
  //         setCurrentChat(rchat?.data);
  //       })();
  //     }
  //   }
  //   return () => (mounted = true);
  // }, []);

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
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    return () => (mounted = true);
  }, [messages, showBox]);

  useEffect(() => {
    let mounted = false;
    if (!mounted) {
      if (audioplay) {
        try {
          document.getElementById("buttonPlayG").click();
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

  function boxClose() {
    dispatch({
      type: "REMOVE_BOX",
      value: {
        receiver: {},
        data: [],
        ventana: false,
      },
    });

    dispatch({
      type: "REMOVE_CONV",
      value: null,
    });
  }

  // --- add emojis--
  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emojis = String.fromCodePoint(...codesArray);
    setNewMessage(newMessage + emojis);
    setShowEmoji(false);
  };

  // get data conversation--
  async function chatboxAccion(data) {
    // si tiene el idconversation data=[tipo=d,idcv,iduser]
    if (data[0] === "d") {
      const resp = await messagesApi(data[1], auth?.User_id, logout);
      const rchat = await getDetailsApi(`${data[1]}`, logout);
      const upmessage = await messagesupdApi(data[2], logout);

      dispatch({
        type: "ADD_CONV",
        value: data[1],
      });

      // chatbox(data[1]);
      setMessages(resp?.data);
      setCurrentChat(rchat?.data);
      setShowBox(true);
    } else {
      // desde contacto data=[tipo=n,iduserreceptor]
      const addconv = await covxDsUser(me?._id, box.receiver._id, logout);
      const resp = await messagesApi(addconv?.data._id, auth?.User_id, logout);
      const rchat = await getDetailsApi(addconv?.data._id, logout);
      dispatch({
        type: "ADD_CONV",
        value: addconv?.data._id,
      });

      setMessages(resp?.data);
      setCurrentChat(rchat?.data);
      // chatbox(addconv?.data._id);
      setShowBox(true);
    }
  }

  // send messages--------
  async function handleKeyDown(e) {
    if (e.key === "Enter") {
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
        receiverId: box.receiver._id,
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

  const typeAceptImage = ["image/jpg", "image/jpeg", "image/png"];
  const changeHandlerFile = async (event) => {
    const image = event.target.files[0];
    if (typeAceptImage.includes(image?.type)) {
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
            receiverId: box.receiver._id,
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
            receiverId: box?.receiver._id,
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

  let arr = Array.apply(null, { length: 50 }).map(Number.call, Number);
  return (
    <>
      <button
        id="buttonPlayG"
        onClick={sonidoplay}
        style={{ display: "none" }}
      ></button>

      <audio className="audio-element">
        <source src="/audio/message.mp3"></source>
      </audio>

      <div className="chat-container">
        <div className="messages-headline">
          <Link href={`/dashboard/profile/${box?.receiver._id}`}>
            <h4 className="cursor-pointer">
              {" "}
              {box?.receiver.name} {box?.receiver.surnames}
            </h4>
          </Link>
          <a className="message-action text-red-500">
            <img
              src="/imgs/btnclose.svg"
              className="cursor-pointer"
              onClick={boxClose}
            ></img>
          </a>
        </div>

        <div className="chat-message-content">
          {messages?.map((m, index) => (
            <div ref={scrollRef} key={index}>
              <MessageItem
                key={index}
                message={m}
                receiver={box?.receiver}
                own={m.sender === auth?.User_id}
                sender={me}
              />
            </div>
          ))}

          {/* {arr.map((item) => (
            <div className="message-bubble">
              <div className="message-bubble-inner">
                <div className="message-avatar">
                  <img src="assets/images/avatars/avatar-2.jpg" alt />
                </div>
                <div className="message-text">
                  <p>
                    {item}
                    Nam liber tempor cum soluta nobis eleifend doming id quod
                    mazim placerat 😎
                  </p>
                </div>
              </div>

              <div className="clearfix" />
            </div>
          ))}  */}
        </div>

        <div className="message-reply">
          <textarea
            cols={1}
            rows={1}
            id="msgInput"
            className="input-chat px-3"
            placeholder="Escribir mensaje"
            onChange={(e) => setNewMessage(e.target.value)}
            value={newMessage}
            onKeyDown={handleKeyDown}
          />

          <button onClick={handleSubmit} className="btnsends">
            <img src="/chatf/msg/send.svg" alt="" />
          </button>

          <button onClick={() => setShowEmoji(true)} className="btnsends">
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
      </div>

      {showEmoji ? <Picker onSelect={addEmoji} /> : null}
    </>
  );
}

function ss() {
  <div className="startbox">
    <div className="messages-container">
      <div className="messages-container-inner">
        <div className="message-content">
          <div className="messages-headline">
            <Link href={`/dashboard/profile/${box?.receiver._id}`}>
              <h4 className="cursor-pointer">
                {" "}
                {box?.receiver.name} {box?.receiver.surnames}
              </h4>
            </Link>
            <a className="message-action text-red-500">
              <img
                src="/imgs/btnclose.svg"
                className="cursor-pointer"
                onClick={boxClose}
              ></img>
            </a>
          </div>
          <div className="message-content-scrolbar " data-simplebar>
            {/* Message Content Inner */}
            <div className="message-content-inner">
              {messages?.map((m, index) => (
                <div ref={scrollRef} key={index}>
                  <MessageItem
                    key={index}
                    message={m}
                    receiver={box?.receiver}
                    own={m.sender === auth?.User_id}
                    sender={me}
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
                className="input-chat px-3"
                placeholder="Escribir mensaje"
                onChange={(e) => setNewMessage(e.target.value)}
                value={newMessage}
                onKeyDown={handleKeyDown}
              />

              <button onClick={handleSubmit} className="btnsends">
                <img src="/chatf/msg/send.svg" alt="" />
              </button>

              <button onClick={() => setShowEmoji(true)} className="btnsends">
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
  </div>;
}
