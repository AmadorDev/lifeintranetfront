// import "../styles/globals.css";
import "../sass/index.scss";
import "react-toastify/dist/ReactToastify.css";

import "../public/assets/css/icons.css";
import "../public/assets/css/uikit.css";
import "../public/assets/css/style.css";
import "../public/assets/css/tailwind.css";
import "emoji-mart/css/emoji-mart.css";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/router";
import jwtdecode from "jwt-decode";
import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";

//--------context
import AuthContext from "../context/AuthContext";
import ChatContext from "../context/ChatContext";
// ---------
import { setToken, getToken, removeToken } from "../utils/token";

// app provider
import { AppProvider } from "../providers/AppProvider";



function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [auth, setAuth] = useState(undefined);
  const [me, setMe] = useState([]);
  const [reloaduser, setReloadUser] = useState(false);
  const [chat, setChat] = useState(undefined);

  useEffect(async () => {
    const token = getToken();
    if (token) {
      await getMe(token);
      setAuth({
        token,
        User_id: jwtdecode(token)._id,
      });
    } else {
      setAuth(null);
    }
    setReloadUser(false);
  }, [reloaduser]);

  async function getMe(token) {
    try {
      const resp = await fetch(process.env.URL_API + "/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await resp.json();
      if (result.msg === "OK") {
        setMe(result.data);
      } else {
        removeToken();
        setAuth(null);
      }
    } catch (error) {
      
    }
  }

  const login = (token, me) => {
    setToken(token);
    setAuth({
      token,
      User_id: jwtdecode(token)._id,
    });
    setMe(me);
  };
  const chatbox = (data) => {
    setChat(data);
  };
  const logout = () => {
    if (auth) {
      removeToken();
      setAuth(null);
      router.push("/");
    }
  };

  const authData = useMemo(
    () => ({
      auth,
      me,
      login,
      logout,
      setReloadUser,
    }),
    [auth, me]
  );
  const chatData = useMemo(
    () => ({
      chat,
      chatbox,
    }),
    [chat]
  );
  
  if (auth === undefined) return null;
  return (
    <AppProvider>
      <AuthContext.Provider value={authData}>
        <ChatContext.Provider value={chatData}>
         <Component {...pageProps} />

          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <Toaster position="bottom-right" reverseOrder={false} />
        </ChatContext.Provider>
      </AuthContext.Provider>
    </AppProvider>
  );
}

export default MyApp;
