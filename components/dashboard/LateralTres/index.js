import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { io } from "socket.io-client";
import { BASE_HOST } from "../../../utils/constants";

import { apiFriend } from "../../../api/userApi";
import { useAppContext } from "../../../providers/AppProvider";
import useAuth from "../../../hooks/useAuth";

import AttendanceC from "../../utils/AttendanceC";
import { Account } from "../../base/HeaderNav/ItemsHeader";

export default function index() {
  const { friends, hbs, dispatch } = useAppContext();
  const { logout, auth, me } = useAuth();
  const router = useRouter();

  const [onlineUsers, setOnlineUsers] = useState([]);
  const [online, setOnline] = useState([]);

  const socket = useRef();

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

  // ------
  // cada vez que se conect usuario revisa si es de tus amigos
  // ------
  function watchOnline() {
    const friendsOnline = friends?.map((f) => {
      if (onlineUsers.some((i) => i._id == f._id)) {
        f.online = 1;
      } else {
        f.online = 0;
      }
      return f;
    });
    setOnline(friendsOnline);
  }

  function showChatBox(item) {
    dispatch({
      type: "ADD_BOX",
      value: {
        receiver: item,
        data: ["n"],
        ventana: true,
      },
    });
  }

  useEffect(() => {
    let isMounted = false;
    if (!isMounted) {
      watchOnline();
    }
    return () => {
      isMounted = true;
    };
  }, [onlineUsers]);

  function viewPerfil(id) {
    router.push(`/dashboard/profile/` + id);
  }

  return (
    <>
      <div className="lg:w-72 w-full mt-3 mt-md-0">
        <div className=" justify-center my-account items-center hidden md:flex">
          <Account /> <div className="mx-2">Mi cuenta</div>
        </div>
        <AttendanceC></AttendanceC>

        {hbs.length > 0 ? (
          <>
            <div className="linecolors mt-3" />
            <h4 className="text-xl font-semibold mb-2 "> Cumpleaños </h4>

            {hbs?.map((item, index) => (
              <div
                className="flex py-2 pl-2 mb-2 rounded-md hover:bg-gray-200"
                key={item._id + index}
              >
                <Link href={`/dashboard/profile/${item._id}`}>
                  <a>
                    <img
                      src="/assets/images/icons/gift-icon.png"
                      className="w-9 h-9 mr-3"
                    />
                  </a>
                </Link>
                <p className="line-clamp-2">
                  <strong> {item.name} </strong>
                </p>
              </div>
            ))}
          </>
        ) : null}

        {/* <h3 className="text-xl font-semibold"> Contacts </h3> */}
        <div className="" data-uk-sticky="offset:80">
          <div className="linecolors mt-3" />
          <div className="row justify-content-center text-center mt-3">
            <div className="col-12">
              <span
                className="t-title text-center"
                style={{ fontSize: "20px" }}
              >
                Amigos
              </span>{" "}
              <span
                className="badge rounded-pill bg-pri"
                style={{ fontSize: "14px" }}
              >
                {online?.length}
              </span>
            </div>
          </div>
          <div className="linecolors mt-3" />
          <div className="contact-list">
            {online?.map((item, index) => (
              <a key={item._id + index}>
                <div
                  className="contact-avatar cursor-pointer"
                  onClick={() => viewPerfil(item._id)}
                >
                  <img src={item.profilePicture} />
                  <span
                    className={
                      item.online ? "user_status status_online" : "user_status"
                    }
                  />
                </div>
                <div className="contact-username ">
                  <span className="t-title">
                    {" "}
                    {item.name} {item.surnames}
                  </span>
                  <img
                    src="/imgs/coment.svg"
                    width="20"
                    className="inline ml-2 poiter cursor-pointer"
                    onClick={() => showChatBox(item)}
                  ></img>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
