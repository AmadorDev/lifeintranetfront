import { useEffect, useState } from "react";
import { useRouter } from "next/dist/client/router";
import Container from "../../../components/base";
import PerfilAbout from "../../../components/dashboard/Perfil/PerfilAbout";
import Friend from "../../../components/dashboard/Perfil/Friend";
import useAuth from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import {
  apiFriendAdd,
  apiFriendRemove,
  apiFriendVerify,
  apiFriendxId,
  apiMeCall,
} from "../../../api/userApi";

import { useAppContext } from "../../../providers/AppProvider";

import PageError from "../../../components/errors/PageError";
import ContactEmergency from "../../../components/dashboard/Perfil/ContactEmergency";
import CertificateByUser from "../../../components/dashboard/Perfil/CertificateByUser";

function detalle({ id }) {
  const router = useRouter();
  const { logout, auth, me, setReloadUser } = useAuth();
  const { friends, dispatch } = useAppContext();
  const [showBox, setShowBox] = useState(0);

  const [perfil, setPerfil] = useState([]);
  const [countFriend, setCountFriend] = useState(0);
  const [isFriend, setIsFriend] = useState(false);
  const isLoading = false;
  const isAuthenticated = false;
 

  // authenticate------------

  useEffect(() => {
    if (!isLoading && !auth?.User_id) {
      router.push("/");
    }
  }, [auth?.User_id, isLoading]);

  if (isLoading || !auth?.User_id) {
    // return <Preloader />;
    return null;
  }

  if (id === 0) {
    return <PageError></PageError>;
  }

  // authenticate---------------
  async function getPerfil() {
    try {
      const resp = await apiMeCall(logout, id);
      if (resp?.msg === "OK") {
        setPerfil(resp?.data);
      }
    } catch (error) {}
  }
  async function verifyFriend() {
    try {
      const resp = await apiFriendVerify(logout, id);
      if (resp?.msg === "OK") {
        setIsFriend(resp?.data);
      }
    } catch (error) {}
  }
  useEffect(() => {
    let isMounted = false;
    if (!isMounted) {
      getPerfil();
    }
    return () => {
      isMounted = true;
    };
  }, [id]);

  useEffect(() => {
    let isMounted = false;
    if (!isMounted) {
      verifyFriend();
    }
    return () => {
      isMounted = true;
    };
  }, [id]);

  async function addFriend() {
    try {
      const resp = await apiFriendAdd(logout, {
        friends: id,
      });
      if (resp?.msg === "OK") {
        toast(`Agregaste a ${resp?.data.name} en tu lista de amigos `, {
          icon: "👏",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        dispatch({ type: "ADD_ITEM_FRIEND", value: resp?.data });
        setIsFriend(true);
      }
    } catch (error) {}
  }

  async function removeFriend() {
    try {
      const resp = await apiFriendRemove(logout, id);
      if (resp?.msg === "OK") {
        toast(`Quitaste  de tu lista de amigos `, {
          icon: "👏",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        dispatch({ type: "REMOVE_ITEM_FRIEND", value: id });
        setIsFriend(false);
      }
    } catch (error) {}
  }

  function SwitchCase({ value }) {
    switch (value) {
      case 0:
        return (
          <>
            <div className="row">
              <div className="col-12 col-md-6">
                Datos Personales:
                <PerfilAbout data={perfil} isFriend={false}></PerfilAbout>
              </div>
              {me?.role === "Administrador" ? (
                <div className="col-12 col-md-6 mt-3 mt-md-0">
                  <ContactEmergency logout={logout} id={id}></ContactEmergency>
                </div>
              ) : null}
            </div>
            {me.role === "Administrador" ? (
              <div className="row mt-3">
                <div className="col-12 mt-3 mt-md-0">
                  Certificados:
                  <CertificateByUser
                    logout={logout}
                    id={id}
                  ></CertificateByUser>
                </div>
              </div>
            ) : null}
          </>
        );
      case 1:
        return <Friend id={id} setCountFriend={setCountFriend}></Friend>;
      default:
        return null;
    }
  }
  return (
    <Container>
      <div className="profile user-profile">
        <div className="profiles_banner">
          <div className="image-upload">
            <img src="/imgs/banner.jpg" />
          </div>
        </div>
        <div className="profiles_content">
          <div className="profile_avatar">
            <div className="profile_avatar_holder">
              <div className="image-upload">
                <label htmlFor="fileavatar">
                  <img src={perfil?.profilePicture} />
                </label>
              </div>
            </div>
            {/* <div className="user_status status_online" /> */}
          </div>
          <div className="profile_info">
            <h1>
              {" "}
              {perfil?.name} {perfil?.surnames}{" "}
            </h1>
            <p className="text-center">{perfil?.puesto}</p>
          </div>
        </div>
        <div className="flex justify-between lg:border-t flex-col-reverse lg:flex-row">
          <nav className="responsive-nav pl-2 is_ligh -mb-0.5 border-transparent">
            <ul uk-switcher="connect: #timeline-tab; animation: uk-animation-fade">
              <li onClick={() => setShowBox(0)}>
                <a className="lg:px-2 poiter"> Información</a>
              </li>
              <li onClick={() => setShowBox(1)}>
                <a className="lg:px-2 poiter">
                  Amigos{" "}
                  <span className="bgIconMsg text-white">{countFriend}</span>{" "}
                </a>
              </li>
            </ul>
          </nav>
          {isFriend ? (
            <div
              className="flex items-center space-x-1.5 flex-shrink-0 pr-3  justify-center order-1"
              onClick={removeFriend}
            >
              <a className="flex items-center justify-center h-10 px-5 rounded-md  text-white btn-secon text-white py-2 px-4 rounded-full  space-x-1.5 poiter">
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  width={32}
                  height={32}
                  viewBox="0 0 32 32"
                  fill="#eee"
                >
                  <circle />
                  <title>remove</title>
                  <path d="M12 23c0-4.726 2.996-8.765 7.189-10.319 0.509-1.142 0.811-2.411 0.811-3.681 0-4.971 0-9-6-9s-6 4.029-6 9c0 3.096 1.797 6.191 4 7.432v1.649c-6.784 0.555-12 3.888-12 7.918h12.416c-0.271-0.954-0.416-1.96-0.416-3z" />
                  <path d="M23 14c-4.971 0-9 4.029-9 9s4.029 9 9 9c4.971 0 9-4.029 9-9s-4.029-9-9-9zM28 24h-10v-2h10v2z" />
                </svg>

                <span> Amigo </span>
              </a>
            </div>
          ) : (
            <div
              className="flex items-center space-x-1.5 flex-shrink-0 pr-3  justify-center order-1"
              onClick={addFriend}
            >
              <a className="flex items-center justify-center h-10 px-5 rounded-md  text-white btn-pri text-white py-2 px-4 rounded-full  space-x-1.5 poiter">
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  width={32}
                  height={32}
                  viewBox="0 0 32 32"
                >
                  <title>add</title>
                  <path
                    fill="#fff"
                    d="M12 23c0-4.726 2.996-8.765 7.189-10.319 0.509-1.142 0.811-2.411 0.811-3.681 0-4.971 0-9-6-9s-6 4.029-6 9c0 3.096 1.797 6.191 4 7.432v1.649c-6.784 0.555-12 3.888-12 7.918h12.416c-0.271-0.954-0.416-1.96-0.416-3z"
                  />
                  <path
                    fill="#fff"
                    d="M23 14c-4.971 0-9 4.029-9 9s4.029 9 9 9c4.971 0 9-4.029 9-9s-4.029-9-9-9zM28 24h-4v4h-2v-4h-4v-2h4v-4h2v4h4v2z"
                  />
                </svg>
                <span> Amigo </span>
              </a>
            </div>
          )}
        </div>
      </div>

      <SwitchCase value={showBox} />
    </Container>
  );
}

export const getServerSideProps = async ({ query }) => {
  const resp = await fetch(
    `${process.env.URL_API}/users/validateobjects/${query.id}`
  );
  const result = await resp.json();

  if (result.data === false || result.data.length === 0) {
    return {
      // redirect: {
      //   permanent: false,
      //   destination: "/dashboard/profile",
      // },
      props: { id: 0 },
    };
  }
  return {
    props: { id: query.id },
  };
};
export default detalle;
