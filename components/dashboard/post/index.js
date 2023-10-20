import Link from "next/link";
import { useRouter } from "next/router";

import React, { useState, useEffect, useRef } from "react";
import FilesImgs from "./FilesImgs";

import { toast } from "react-toastify";

import FormData from "form-data";
import {
  postDocsApi,
  postImgApi,
  postSimpleApi,
  postsListApi,
} from "../../../api/postApi";
import FileDocs from "./FileDocs";

// components
import ListPost from "./ListPost";
import ModalPer from "../../utils/ModalPer";
import { Button } from "react-bootstrap";
import ModalSimple from "../../utils/ModalSimple";

// socketio
import { io } from "socket.io-client";
import { BASE_HOST } from "../../../utils/constants";

// api
import { categorieListApi } from "../../../api/categorieApi";
import { list } from "../../../api/areaApi";

import LoaderSimple from "../../utils/LoaderSimple";
import ModalTd from "../../utils/ModalTd";
const nl2br = require("react-nl2br");
export default function Posts({
  logout,
  auth,
  me,
  codearea,
  setcodearea,
  cateid,
  setcateid,
  setrefresPost,
}) {
  const router = useRouter();
  const [txt, setTxt] = useState({ des: "", cate: "", area: "feed" });
  const [urlvideo, seturlvideo] = useState("");
  const [filesdata, setfilesdata] = useState([]);
  const [docsdata, setdocsdata] = useState([]);
  const [loader, setLoader] = useState(false);
  const [typepost, setTypepost] = useState(null);

  // filters
  const [loadingpost, setloadingpost] = useState(false);
  const [newfilters, setNewfilters] = useState({ area: "", cate: "" });
  const [showreset, setshowreset] = useState(false);

  // iconos
  const [icoImg, seticoImg] = useState(true);
  const [iconVideo, seticonVideo] = useState(true);
  const [iconDoc, seticonDoc] = useState(true);

  // list post
  const [posts, setposts] = useState([]);
  const [postPage, setpostPage] = useState(1);
  const [nextPage, setNextPage] = useState(false);
  const [refreshPost, setRefreshPost] = useState(false);

  // categories
  const [categories, setcategories] = useState([]);

  // areas
  const [areas, setAreas] = useState([]);

  //usuarios que le dieron like
  const [userLikes, setuserLikes] = useState([]);
  const [pageLikesuser, setpageLikesuser] = useState(1);

  // socket
  const socket = useRef();
  const scrollRef = useRef();

  // experimental-socketspostnews
  // useEffect(() => {
  //   let mounted = false;

  //   socket.current = io(`${BASE_HOST}`, {
  //     query: { token: auth.token },
  //   });
  //   socket.current.on("getPost", (data) => {
  //     if (!mounted) {
  //       console.log("----soc", data.data[0].empresa);
  //       setposts((old) => [...data.data, ...old]);
  //     }
  //   });

  //   return () => (mounted = true);
  // }, []);

  // categories
  useEffect(() => {
    let isMounted = false;
    if (!isMounted) {
      listCategories();
    }
    return () => {
      isMounted = true;
    };
  }, []);

  // areas
  useEffect(() => {
    let isMounted = false;
    if (!isMounted) {
      listAreas();
    }
    return () => {
      isMounted = true;
    };
  }, []);

  function nextpageLikedW() {
    setpageLikesuser(pageLikesuser + 1);
  }
  function nextpageLiked() {
    // setpageLikesuser(a);
  }
  function cleardatalikedusers() {
    setuserLikes(() => []);
  }
  const listCategories = async () => {
    try {
      const resp = await categorieListApi(logout, true);
      if (resp.msg === "OK") {
        setcategories(resp.data);
      }
    } catch (error) {}
  };

  const listAreas = async () => {
    try {
      const resp = await list(logout);
      if (resp.msg === "OK") {
        setAreas(resp.data);
      }
    } catch (error) {}
  };

  const fetchPost = async (page) => {
    try {
      const reps = await postsListApi(page, logout, codearea, cateid);
      if (reps.msg === "OK") {
        const datas = posts.concat(reps.data);
        const newposts = Array.from(new Set(datas.map(JSON.stringify))).map(
          JSON.parse
        );
        setposts(newposts);
        setNextPage(reps.next);
      }
    } catch (error) {}
  };

  useEffect(() => {
    let mounted = false;
    if (!mounted) {
      fetchPost(postPage);
    }
    return () => {
      mounted = true;
    };
  }, [postPage, codearea, cateid]);
  function morePosts() {
    setpostPage(postPage + 1);
  }

  function removeImage(id) {
    const newList = filesdata.filter((item, ind) => item.id !== id);
    setfilesdata(newList);
  }
  function removeDocs(id) {
    const newList = docsdata.filter((item, ind) => item.id !== id);
    setdocsdata(newList);
  }
  async function sendImgs() {
    const formData = new FormData();
    filesdata?.map((item) => {
      formData.append("postsImg", item.file);
    });
    formData.append("description", txt.des);
    formData.append("category", txt.cate);
    formData.append("area", txt.area);

    try {
      const resp = await postImgApi(formData, logout);
      if (resp.msg === "OK") {
        // socket.current.emit("addPos", { data: resp.data });
        // añandir al listado de posts
        setposts((old) => [...resp.data, ...old]);
      } else {
        toast.error("Límite de archivos excedido");
      }
      setLoader(false);
      clearInputs();
      setfilesdata([]);
    } catch (error) {
      toast.error("error en el proceso");
      setLoader(false);
      clearInputs();
      setfilesdata([]);
    }
  }

  async function sendDocs() {
    const formData = new FormData();
    docsdata?.map((item) => {
      formData.append("postsDocs", item.file);
    });
    formData.append("description", txt.des);
    formData.append("category", txt.cate);
    formData.append("area", txt.area);

    try {
      const resp = await postDocsApi(formData, logout);
      if (resp.msg === "OK") {
        // socket.current.emit("addPos", { data: resp.data });
        setposts((old) => [...resp.data, ...old]);
      } else {
        toast.error("Límite de archivos excedido");
      }
      setLoader(false);
      clearInputs();
      setdocsdata([]);
    } catch (error) {
      toast.error("error en el proceso");
      setLoader(false);
      clearInputs();
      setdocsdata([]);
    }
  }

  async function sendVideo() {
    seticoImg(false);
    seticonDoc(false);
    // let des = urlvideo.replace(/ /g, "");
    // if (des.length < 1) {
    //   const inp = document.querySelector("#txturlvideo");
    //   if (inp) {
    //     inp.focus();
    //   }
    // }
  }

  async function publishPost({ logout }) {
    let des = txt.des.replace(/ /g, "");
    if (des.length < 1 || txt.des === "") {
      return toast.error("Descripcion requerida");
    }
    if (txt.cate === "") {
      return toast.error("Seleccione una categoria");
    }
    if (icoImg) {
      setLoader(true);
      return await sendImgs();
    }
    if (iconDoc) {
      setLoader(true);
      return await sendDocs();
    }
    if (iconVideo) {
      setLoader(true);
      try {
        let embed;
        if (urlvideo.includes("v=")) {
          embed = urlvideo.split("v=")[1];
        } else {
          embed = urlvideo.split("/")[3];
        }

        const formData = {
          description: txt.des,
          category: txt.cate,
          area: txt.area,
          url: embed,
        };
        const resp = await postSimpleApi(JSON.stringify(formData), logout);
        if (resp.msg === "OK") {
          // socket.current.emit("addPos", { data: resp.data });
          setposts((old) => [...resp.data, ...old]);
        } else {
          toast.error("Sucedió un error");
        }
        setLoader(false);
        clearInputs();
      } catch (error) {
        toast.error("error en el proceso");
        setLoader(false);
        clearInputs();
      }
    }
  }

  const btncloseAdd = useRef();
  function clearInputs() {
    resetValues();
    btncloseAdd.current.click();
  }

  function resetValues() {
    setTxt({ des: "", cate: "", area: "feed" });
    seticoImg(true);
    seticonVideo(true);
    seticonDoc(true);
    setLoader(false);
    setfilesdata([]);
    setdocsdata([]);
    seturlvideo("");
  }

  async function newFiltro() {
    setpostPage(1);
    setposts((old) => []);
    setcodearea((e) => newfilters.area);
    setcateid((e) => newfilters.cate);
    setshowreset(true);
  }

  async function resetFilters() {
    setshowreset(false);
    setposts((old) => []);
    setpostPage(1);
    setcodearea((e) => "feed");
    setcateid((e) => "");
    setNewfilters({ area: "", cate: "" });
  }

  // refres posts
  async function refreshPosts() {
    setrefresPost(false);
    setTimeout(() => {
      // setcodearea((e) => "feed");
      // setcateid((e) => "");
      setrefresPost(true);
    }, 3000);
  }

  //
  function viewPerfil(id) {
    cleardatalikedusers();
    document.getElementById("viewLiked_close").click();
    router.push(`/dashboard/profile/${id}`);
  }

  console.log(me)
  return (
    <>
      <div className="lg:w-3/4 lg:px-5 space-y-5">
        {/* -----------------container bloque 2-------------------- */}
        <div
          className="collapse collapse-horizontal card"
          id="collapseWidthExample"
        >
          <div className="row  p-3">
            <div className="col-12 col-md-4">
              <div className="mb-3">
                <select
                  id="disabledSelect"
                  className="select-custom"
                  value={newfilters.area}
                  onChange={(e) =>
                    setNewfilters({
                      area: e.target.value,
                      cate: newfilters.cate,
                    })
                  }
                >
                  <option value="">Areá</option>
                  {areas?.map((item) => (
                    <option value={item.code} key={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="mb-3">
                <select
                  id="disabledSelect"
                  className="select-custom"
                  value={newfilters.cate}
                  onChange={(e) =>
                    setNewfilters({
                      cate: e.target.value,
                      area: newfilters.area,
                    })
                  }
                >
                  <option value="">Categoria</option>
                  {categories?.map((item) => (
                    <option value={item._id} key={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-12 col-md-4 self-center text-center">
              <div className="">
                {newfilters.area && newfilters.cate ? (
                  <button
                    className="btn-secon text-white font-bold py-2 px-4 rounded-full"
                    onClick={newFiltro}
                  >
                    Filtrar
                  </button>
                ) : null}
                {showreset ? (
                  <button
                    className="btn-secon text-white font-bold py-2 px-4 rounded-full"
                    onClick={resetFilters}
                  >
                    Posts públicos
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-6 col-md-3">
            <button
              className="btn-pri text-white py-2 px-4 rounded-full"
              onClick={refreshPosts}
            >
              Actualizar
            </button>
          </div>
          {me?.role === "Administrador" ? (
            <div className="col-6 col-md-3">
              <button
                className="btn-secon text-white  py-2 px-4 rounded-full"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseWidthExample"
                aria-expanded="false"
                aria-controls="collapseWidthExample"
              >
                Filtros
              </button>
            </div>
          ) : null}
        </div>
        {/* solo admin */}
        {me?.role === "Administrador" ? (
          <>
            <div className="card lg:mx-0 p-4 mt-3">
              <div className="flex space-x-3">
                <span data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  className="flex-1  rounded-full">
                  Publicar nuevo post... </span>
                  
                {/* <input
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  placeholder="Publicar nuevo post..."
                  className="input-p flex-1 h-10 px-6 rounded-full"
                /> */}
              </div>
            </div>
            {/* Modal create New post*/}
            <ModalPer
              id="exampleModal"
              estils="modal-dialog-centered"
              title="Nuevo post"
              btncloseAdd={btncloseAdd}
            >
              {/* go post */}
              <div className="flex flex-1 items-start space-x-4 p-2">
                <img
                  src="assets/images/avatars/avatar-2.jpg"
                  className="bg-gray-200 border border-white rounded-full w-11 h-11"
                />
                <div className="flex-1 pt-2">
                  <textarea
                    className="uk-textare text-black shadow-none focus:shadow-none text-xl font-medium resize-none tareaPost"
                    rows={5}
                    placeholder="Escribir una descripción"
                    value={txt.des}
                    required={true}
                    onChange={(e) => setTxt({ ...txt, des: e.target.value })}
                  />
                </div>
              </div>
              <div className="row p-2">
                {filesdata?.map((it, index) => (
                  <div
                    className="col-4 text-end"
                    key={it.id}
                    onClick={() => removeImage(it.id)}
                  >
                    <button
                      type="button text-end"
                      className="btn-close bg-gray-100 rounded-full"
                    ></button>
                    <img src={it.url} alt="" className="img-fluid" />
                  </div>
                ))}
              </div>
              <ol className="list-group">
                {docsdata?.map((it) => (
                  <li
                    className="list-group-item d-flex justify-content-between align-items-start"
                    key={it.id}
                  >
                    <div className="ms-2 me-auto">{it.name}</div>
                    <span
                      className="badge bg-danger rounded-pill poiter bg-gray-100 rounded-full"
                      onClick={() => removeDocs(it.id)}
                    >
                      X
                    </span>
                  </li>
                ))}
              </ol>

              {!iconDoc && !icoImg ? (
                <input
                  type="text"
                  id="txturlvideo"
                  className="form-control focus:outline-none focus:ring focus:border-blue-300 inputvideo"
                  placeholder="ejem: https://youtu.be/mN9RSnu_xDc"
                  value={urlvideo}
                  onChange={(e) => seturlvideo(e.target.value)}
                />
              ) : null}

              <div className="bsolute bottom-0 p-2 space-x-4 w-full">
                <div className="flex bg-gray-50 border border-purple-100 rounded-2xl p-2 shadow-sm items-center">
                  <div className="flex flex-1 items-center  justify-center space-x-2">
                    {icoImg ? (
                      <FilesImgs
                        setfilesdata={setfilesdata}
                        filesdata={filesdata}
                        seticonVideo={seticonVideo}
                        seticonDoc={seticonDoc}
                      ></FilesImgs>
                    ) : null}
                    {iconVideo ? (
                      <svg
                        className="text-red-600 h-9 p-1.5 rounded-full bg-red-100 w-9 cursor-pointer"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={sendVideo}
                      >
                        {" "}
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                        >
                          {" "}
                        </path>
                      </svg>
                    ) : null}
                    {iconDoc ? (
                      <FileDocs
                        setdocsdata={setdocsdata}
                        docsdata={docsdata}
                        seticoImg={seticoImg}
                        seticonVideo={seticonVideo}
                      ></FileDocs>
                    ) : null}

                    <img
                      onClick={resetValues}
                      src="/posts/reset.png"
                      alt=""
                      width=""
                      className="text-orange-600 h-9 p-1.5 rounded-full bg-yellow-100 w-9 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              <div className="row border-t">
                <div className="col-12">
                  <select
                    className="select-custom mt-2"
                    value={txt.cate}
                    onChange={(e) => setTxt({ ...txt, cate: e.target.value })}
                  >
                    <option value="">Elegir Categoria</option>
                    {categories?.map((item) => (
                      <option value={item._id} key={item._id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12">
                  <select
                    className="select-custom mt-2"
                    value={txt.area}
                    onChange={(e) => setTxt({ ...txt, area: e.target.value })}
                  >
                    <option value="feed">Público</option>
                    {areas?.map((item) => (
                      <option value={item.code} key={item._id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12 text-end">
                  <button className="btn-pri text-white  py-2 px-4 rounded-full" onClick={publishPost}>
                    {loader ? (
                      <span
                        className="spinner-border spinner-border-sm mr-1"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    ) : null}
                    Publicar
                  </button>
                </div>
              </div>

              {/* end post */}
            </ModalPer>
          </>
        ) : null}

        {/* list */}
        {posts?.map((item, index) => (
          <ListPost
            key={item._id + index}
            posts={item}
            userLikes={userLikes}
            setuserLikes={setuserLikes}
            pageLikesuser={pageLikesuser}
            setpageLikesuser={setpageLikesuser}
            nextpageLiked={nextpageLiked}
            setposts={setposts}
            dataposts={posts}
          ></ListPost>
        ))}
        {refreshPost ? <LoaderSimple></LoaderSimple> : null}

        {/* -----------------pagination-------------------- */}
        {nextPage ? (
          <div className="flex justify-center mt-6">
            <a
              className="bg-white dark:bg-gray-900 font-semibold my-3 px-6 py-2 rounded-full shadow-md dark:bg-gray-800 dark:text-white poiter"
              onClick={morePosts}
            >
              Cargar más ..
            </a>
          </div>
        ) : null}
        {/* -----------------pagination end-------------------- */}

        {/* -----------------likes posts-------------------- */}
        <ModalSimple
          id="viewLiked"
          estils="modal-dialog-centered modal-md modal-dialog-scrollable"
          title=""
          closeBtn={cleardatalikedusers}
        >
          <div className="border-b flex items-center justify-between  p-2">
            <div>
              <h2 className="text-md font-semibold">Total Me gusta</h2>
            </div>
            <a className="text-blue-500">
              {" "}
              {userLikes ? userLikes.length : 0}{" "}
            </a>
          </div>
          <div className="p-3">
            {userLikes?.map((item) => (
              <div
                className="flex items-center space-x-4 rounded-md -mx-2 p-2 hover:bg-gray-50"
                key={item._id}
              >
                <a className="w-12 h-12 flex-shrink-0 overflow-hidden rounded-full relative">
                  <img
                    src={item.profilePicture}
                    className="absolute w-full h-full inset-0 "
                    alt=""
                  />
                </a>

                <div className="flex-1">
                  <a className="text-base font-semibold capitalize">
                    {item.name}
                  </a>
                  <div className="text-sm text-gray-500 mt-0.5">
                    {item.email}
                  </div>
                </div>
                <a
                  className="flex items-center justify-center h-8 px-3 rounded-md text-sm border font-semibold poiter"
                  onClick={() => viewPerfil(item._id)}
                >
                  Ver Perfil
                </a>
              </div>
            ))}
          </div>
          {/* <a
            className="border-t block text-center py-2 poiter"
            onClick={nextpageLikedW}
          >
            ver más
          </a> */}
        </ModalSimple>

        {/* -----------------likes posts end-------------------- */}
      </div>
      {/* -----------------container bloque 2 end-------------------- */}
    </>
  );
}
