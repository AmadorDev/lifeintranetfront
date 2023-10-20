import { useEffect, useState } from "react";
import { useRouter } from "next/dist/client/router";
import Container from "../../../components/base";
import PerfilAbout from "../../../components/dashboard/Perfil/PerfilAbout";
import Friend from "../../../components/dashboard/Perfil/Friend";

import useAuth from "../../../hooks/useAuth";
import { useAppContext } from "../../../providers/AppProvider";

import { toast } from "react-toastify";
import { uploadAvatarApi, uploadCoverApi } from "../../../api/userApi";
import FormData from "form-data";
import ListTipoDocs from "../../../components/regulation/ListTipoDocs";

import ModalTw from "../../../components/utils/ModalTw";

//menu
import Suggestions from "../../../components/dashboard/Perfil/Suggestions";
import Marks from "../../../components/dashboard/Perfil/Marks";
import Directory from "../../../components/dashboard/Perfil/Directory";
import Solicitudes from "../../../components/dashboard/Perfil/Solicitudes";
import AddContactEmergency from "../../../components/dashboard/Perfil/AddContactEmergency";
import Certificate from "../../../components/dashboard/Perfil/Certificate";
import Poll from "../../../components/dashboard/Perfil/Poll";

function index() {
  const router = useRouter();
  const { logout, auth, me, setReloadUser } = useAuth();
  const { user_me, friends, dispatch } = useAppContext();

  const [showBox, setShowBox] = useState(0);
  const [showModal, setShowModal] = useState(false);

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
  // authenticate---------------

  const typeAcept = ["image/jpg", "image/png", "image/jpeg"];
  async function uploadAvatar(e) {
    const img = e.target.files[0];
    if (img) {
      // document.getElementById("fileavatar").value = "";
      if (typeAcept.includes(img?.type)) {
        if (img.size <= process.env.DOCS_SIZE) {
          try {
            setShowModal(true);
            const formData = new FormData();
            formData.append("profile", img);
            const resp = await uploadAvatarApi(auth?.User_id, formData, logout);
            if (resp.msg === "OK") {
              setReloadUser(true);
            } else {
              toast.error("Error en el proceso");
            }
            setShowModal(false);
          } catch (error) {
            setShowModal(false);
            toast.error("Error en el proceso");
          }
        } else {
          toast.error("Peso max 1.5MB");
          document.getElementById("fileavatar").value = "";
        }
      } else {
        document.getElementById("fileavatar").value = "";
        toast.error(typeAcept.join(", "));
      }
    } else {
      document.getElementById("fileavatar").value = "";
    }
  }

  async function uploadCover(e) {
    const img = e.target.files[0];
    if (img) {
      if (typeAcept.includes(img?.type)) {
        if (img.size <= process.env.DOCS_SIZE) {
          try {
            setShowModal(true);
            const formData = new FormData();
            formData.append("cover", img);
            const resp = await uploadCoverApi(logout, formData);

            if (resp?.msg === "OK") {
              user_me.user.cover_page = resp?.data;
              dispatch({
                type: "ADD_ME",
                value: user_me,
              });
            } else {
              toast.error("Error en el proceso");
            }
            setShowModal(false);
          } catch (error) {
            toast.error("Error en el proceso");
            setShowModal(false);
          }
        } else {
          toast.error("Peso max 1.5MB");
          document.getElementById("fileCover").value = "";
        }
      } else {
        document.getElementById("fileCover").value = "";
        toast.error(typeAcept.join(", "));
      }
    } else {
      document.getElementById("fileCover").value = "";
    }
  }

  function SwitchCase({value}) {
    switch (value) {
      case 0:
        return (
          <>
            <div className="row mb-3">
              <div className="col-12 col-md-6">
                Datos personales:
                <PerfilAbout data={me} isFriend={true}></PerfilAbout>
              </div>

              <div className="col-12 col-md-6 mt-3 mt-md-0">
                Persona de contacto:
                <AddContactEmergency logout={logout}></AddContactEmergency>
              </div>
            </div>
            <hr className=""></hr>
            <div className="row mt-3">
              <div className="col-12">
                <Certificate logout={logout} auth={auth}></Certificate>
              </div>
            </div>
          </>
        );
      case 1:
        return <ListTipoDocs logout={logout}></ListTipoDocs>;
      case 2:
        return <Friend></Friend>;
      case 3:
        return <Suggestions logout={logout}></Suggestions>;
      case 4:
        return <Marks />;
      case 5:
        return <Directory />;
      case 6:
        return <Solicitudes logout={logout}></Solicitudes>;
      case 7:
        return <Poll logout={logout}></Poll>;;
      default:
        return null;
    }
  }

  return (
    <Container>
      <div className="profile user-profile">
        <div className="profiles_banner">
          <div className="image-upload">
            {/* <label htmlFor="fileCover">
              <img   src="/imgs/banner.jpg"/>
             
            </label> */}
            <img src="/imgs/banner.jpg" />
            {/* <input
              id="fileCover"
              type="file"
              accept="image/jpg, image/png, image/jpeg"
              onChange={(e) => uploadCover(e)}
            /> */}
          </div>
        </div>
        <div className="profiles_content">
          <div className="profile_avatar">
            <div className="profile_avatar_holder">
              <div className="image-upload">
                <label htmlFor="fileavatar">
                  <img src={me?.profilePicture} />
                </label>
                <input
                  id="fileavatar"
                  type="file"
                  accept="image/jpg, image/png, image/jpeg"
                  onChange={(e) => uploadAvatar(e)}
                />
              </div>
            </div>
            <div className="user_status status_online" />
            <div className="icon_change_photo" hidden>
              {" "}
              <ion-icon name="camera" className="text-xl" />{" "}
            </div>
          </div>
          <div className="profile_info">
            <h1 className="t-title t-color">
              {" "}
              {me?.name} {me?.surnames}
            </h1>
            <p className="text-center">{me?.puesto}</p>
          </div>
        </div>
        <div className="flex justify-between lg:border-t flex-col-reverse lg:flex-row">
          <nav className="responsive-nav pl-2 is_ligh -mb-0.5 border-transparent">
            <ul uk-switcher="connect: #timeline-tab; animation: uk-animation-fade">
              <li onClick={() => setShowBox(0)}>
                <a
                  className=" poiter"
                  style={{ fontSize: "18px !important" }}
                >
                  {" "}
                  Información
                </a>
              </li>
              <li onClick={() => setShowBox(1)}>
                <a className=" poiter"> Documentos</a>
              </li>
              <li onClick={() => setShowBox(2)}>
                <a className=" poiter">
                  Amigos{" "}
                  <span className="bgIconMsg text-white">
                    {friends?.length}
                  </span>{" "}
                </a>
              </li>
              <li onClick={() => setShowBox(3)}>
                <a className=" poiter">Sugerencias</a>
              </li>
              <li onClick={() => setShowBox(6)}>
                <a className=" poiter">Solicitudes</a>
              </li>
              <li onClick={() => setShowBox(4)}>
                <a className=" poiter">Marcas</a>
              </li>
              <li onClick={() => setShowBox(5)}>
                <a className=" poiter">Directorio</a>
              </li>
              <li onClick={() => setShowBox(7)}>
                <a className=" poiter">Encuestas</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <ModalTw showModal={showModal}></ModalTw>
      <SwitchCase value={showBox} />
    </Container>
  );
}

export default index;
