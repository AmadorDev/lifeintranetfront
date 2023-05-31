import React, { useState, useEffect } from "react";
import { FormatTimes } from "../../../utils/timenow";
import { commentLikeApi,commentRemoveApi,commentCountApi } from "../../../api/commentApi";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
export default function Comment({idpost, datacomments,setdatacomments,data, setcountTotal,auth, logout }) {
  const { me } = useAuth();
  const router = useRouter();
  const [heart, setheart] = useState(false);
  const [coutnlikes, setcoutnlikes] = useState(data.likes.length);
  async function likeCommnet() {
    try {
      const rep = await commentLikeApi(data._id, logout);
      if (rep.msg === "OK") {
        setcoutnlikes(rep.data.likes.length);
      }
    } catch (error) {}
  }



  function isHeat() {
    let newvalue = data.likes.includes(auth.User_id);
    setheart(newvalue);
  }
  // useEffect(() => {
  //   let isMouted = false;
  //   if (!isMouted) {
  //     isHeat();
  //   }
  //   return () => {
  //     isMouted = true;
  //   };
  // }, [heart]);

  function viewPerfil() {
    router.push(`/dashboard/profile/${data.user._id}`);
  }

  function canceleToast(t){
    toast.dismiss(t.id)
    
  }
  async function deleteComent(t){
    //id coment = data._id
    toast.dismiss(t.id)
    try {
      const resp =await commentRemoveApi(data._id,logout);
      console.log("result",resp)
      if(resp?.msg === 'OK'){
        // let cmts = datacomments.filter((items)=>items._id !== data._id )
        
        setdatacomments((old)=>{
          return old.filter((items)=>items._id !== data._id )
        });
        toast.success('Eliminado correctamente!')
        setcountTotal((old)=>parseInt(old)- 1)

      }else{
        toast.error(resp.data)
      }

    } catch (e) {
      toast.error(e)
      
        }
    
  }

  // async function countComments() {
  //   try {
  //     const resp = await commentCountApi(idpost, logout);
  //     console.log("newtotal comment",resp)
  //     if (resp.msg === "OK") {
  //       setcountTotal((old)=>parseInt(resp.data) );
  //     }
  //   } catch (error) {}
  // }


   function toasView() {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md  bg-white shadow-lg rounded-lg pointer-events-auto  ring-opacity-5 py-2`}
      >
        <div className="row justify-content-center align-items-center">
         
          <div className="col-12 text-center">
            <h2 className="text-xl font-bold py-4 ">Estas seguro(a)?</h2>
            <p className="text-sm text-gray-500 px-8">
              ¿Realmente quieres eliminar tu cuenta? Este proceso no puede ser
              deshecho
            </p>
          </div>
        </div>
        <div className="row justify-content-center align-items-center text-center mt-3">
          <div className="col-6">
            <button className=" bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100" onClick={(e)=>canceleToast(t)}>
              Cancelar
            </button>
          </div>
          <div className="col-6">
            <button className=" bg-red-500 border border-red-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-red-600" onClick={(e)=>deleteComent(t)}>
              Elimiar
            </button>
          </div>
        </div>
      </div>
    ));
  }
 
  return (
    <div className="flex">
      <div className="w-10 h-10 rounded-full relative flex-shrink-0">
        <img
          onClick={viewPerfil}
          src={data.user.profilePicture}
          alt=""
          className="absolute h-full rounded-full w-full poiter"
          title="Ver Perfil"
        />
      </div>
      <div>
        <div className="text-gray-700 py-2 px-3 rounded-md bg-gray-100 relative lg:ml-5 ml-2 lg:mr-12  dark:bg-gray-800 dark:text-gray-100">
          <span className="t-title t-color">
            {data.user.name} {data.user?.surnames}
          </span>
          <p className="t-sub t-color">{data?.description}</p>
          <div className="absolute w-3 h-3 top-3 -left-1 bg-gray-100 transform rotate-45 dark:bg-gray-800" />
        </div>
        <div className="text-sm flex items-center space-x-3 mt-2 ml-5">
          <span
            className={"text-red-600 poiter"}
            // className={heart ? "text-red-600 poiter" : "text-gray-600 poiter"}
            onClick={likeCommnet}
          >
            <i className="uil-heart " />
            {coutnlikes > 0 ? `(${coutnlikes})` : null}
          </span>
          {/* <a href="#"> Replay </a> */}
          <span> {FormatTimes(data.createdAt)} </span>

          <span className={"text-red-600 poiter"}>
            {" "}
           
            {me?.role === "Administrador" ? (
            <i
            className="uil-trash-alt mr-1 text-red-500"
            onClick={toasView}
          />
          ) : null}
          </span>
        </div>
      </div>
    </div>
  );
}
