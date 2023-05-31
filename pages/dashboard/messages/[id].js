import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";

import { io } from "socket.io-client";

import Container from "../../../components/base";
// import ListContacts from "../../../components/dashbord/ListContacts";
import useAuth from "../../../hooks/useAuth";
// api
import { apiGetUsers, apiMeCall } from "../../../api/userApi";
import {
  covxUserApi,
  messgexIdCovApi,
  getDetailsApi,
  addMessageApi,
} from "../../../api/convApi";
// com
import Coversations from "../../../components/Conversations/index";
import Message from "../../../components/Conversations/Message";
import ChatRigth from "../../../components/Conversations/ChatRigth";

import { BASE_HOST } from "../../../utils/constants";
export default function detalle({ idcv }) {
  const router = useRouter();

  const { logout, auth } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [conv, setConv] = useState([]);
  const [receiver, setReceiver] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sender, setSender] = useState([]);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const socket = useRef();
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(() => {
    socket.current = io(`${BASE_HOST}`);
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
    // return () => socket.close();
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", auth?.User_id);
  }, [auth]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    getUsers();
  }, [auth]);

  // useEffect(() => {
  //   getCoversations();
  // }, [auth]);

  useEffect(() => {
    getMessage();
  }, [auth, idcv]);

  useEffect(() => {
    getDetailsCvs();
  }, [auth, idcv]);

  useEffect(() => {
    getSender();
  }, [auth]);

  async function getUsers() {
    const res = await apiGetUsers(logout);
    setContacts(res?.data.filter((items) => items._id !== auth?.User_id));
  }

  async function getCoversations() {
    const resp = await covxUserApi(auth.User_id, logout);
    setConv(resp.data);
  }
  // detalle de la conversacion actual
  // capturamos el receptor
  async function getDetailsCvs() {
    const resp = await getDetailsApi(`${idcv}`, logout);
    const idReci = resp?.data.members.filter((e) => e !== auth.User_id);
    const recip = await apiMeCall(logout, `${idReci}`);
    setReceiver(recip?.data[0]);
    setCurrentChat(resp?.data);
  }
  async function getMessage() {
    const rep = await messgexIdCovApi(`${idcv}`, logout);
    setMessages(rep?.data);
  }

  async function getSender() {
    const recip = await apiMeCall(logout, `${auth?.User_id}`);
    setSender(recip?.data[0]);
  }

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
        conversationId: idcv,
      };

      const receiverId = currentChat.members.find(
        (member) => member !== auth.User_id
      );

      socket.current.emit("sendMessage", {
        senderId: auth.User_id,
        receiverId,
        text: newMessage,
      });

      try {
        const res = await addMessageApi(message, logout);
        setMessages([...messages, res.data]);
        setNewMessage("");
      } catch (err) {
        
      }
    } else {
      document.getElementById("msgInput").focus();
    }
  };
  return (
    <>
      <Container messages={true} className="is-collapse" body={true}>
        <div className="">
          <span
            uk-toggle="target: .message-content;"
            className="fixed left-0 top-36 bg-red-600 z-10 py-1 px-4 rounded-r-3xl text-white"
          >
            Users
          </span>
          <div className="messages-container">
            <div className="messages-container-inner">
              {/* covs */}
              {/* {conv ? <Coversations conv={conv} /> : null} */}

              {/* ----messages --------*/}
              <div className="message-content">
                <div className="messages-headline">
                  <h4> {receiver?.name} </h4>
                </div>
                <div className="message-content-scrolbar" data-simplebar>
                  {/* Message Content Inner */}
                  <div className="message-content-inner">
                    {messages?.map((m) => (
                      <div ref={scrollRef} key={m._id}>
                        <Message
                          key={m._id}
                          message={m}
                          own={m.sender === auth?.User_id}
                          receiver={receiver}
                          sender={sender}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="message-reply">
                    <textarea
                      cols={1}
                      rows={1}
                      id="msgInput"
                      placeholder="Escribir mensaje"
                      onChange={(e) => setNewMessage(e.target.value)}
                      value={newMessage}
                      onKeyDown={handleKeyDown}
                    />
                    <button
                      className="button ripple-effect btnSend"
                      onClick={handleSubmit}
                    >
                      <i className="icon-feather-send"></i>
                    </button>
                  </div>
                </div>
              </div>
              {/* -----find messages-------- */}
            </div>
          </div>
        </div>
      </Container>
      {/* chat rigth */}
      {/* <ChatRigth contacts={contacts} auth={auth}></ChatRigth> */}
    </>
  );
}

export const getServerSideProps = async ({ query }) => {
  return {
    props: { idcv: query.id },
  };
};
