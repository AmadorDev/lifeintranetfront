import React, { useState, useEffect } from "react";
import Link from "next/link";

import Carrusel from "./Carrusel";
import DocsType from "./DocsType";
import Options from "./Options";
import VideoType from "./VideoType";

import { FormatTimes } from "../../../utils/timenow";
import LikeHeader from "./LikeHeader";
import Comment from "./Comment";

// user
import useAuth from "../../../hooks/useAuth";
import NewComment from "./NewComment";

import { commentListApi, commentCountApi } from "../../../api/commentApi";
import nl2br from "react-nl2br";

export default function ListPost({
  posts,
  setuserLikes,
  userLikes,
  pageLikesuser,
  setpageLikesuser,
  nextpageLiked,
  setposts,
  dataposts,
}) {
  const { auth, logout, me } = useAuth();
  // comments
  const [datacomments, setdatacomments] = useState([]);
  const [nextPage, setnextPage] = useState(1);
  const [countTotal, setcountTotal] = useState(0);

  const FecthComment = async (page) => {
    const reps = await commentListApi(page, posts._id, logout);

    if (reps.msg === "OK") {
      const datas = datacomments.concat(reps.data);
      const newcomments = Array.from(new Set(datas.map(JSON.stringify))).map(
        JSON.parse
      );

      setdatacomments(newcomments);
    }
  };

  useEffect(async () => {
    let mounted = false;
    if (!mounted) {
      FecthComment(nextPage);
    }
    return () => {
      mounted = true;
    };
  }, [nextPage]);

  useEffect(() => {
    let mounted = false;
    if (!mounted) {
      countComments();
    }
    return () => {
      mounted = true;
    };
  }, []);

  async function countComments() {
    try {
      const resp = await commentCountApi(posts._id, logout);
      if (resp.msg === "OK") {
        setcountTotal(parseInt(resp.data));
      }
    } catch (error) {}
  }

  function moreComments() {
    setnextPage(nextPage + 1);
  }

  function convert(text,id) {
    let d = document.querySelector("#psDes"+id);

    let exp =
      /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    let text1 = text?.replace(
      exp,
      "<a href='$1' target='_blank' title='$1'>$1</a>"
    );

    let exp2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

    let result = text1.replace(
      exp2,
      '$1<a target="_blank" title="$2" href="http://$2">$2</a>'
    );

    //respeta los espacios y saltos de linea
    let textFinal = result.replace(/(?:\r\n|\r|\n)/g, '<br>');

    d.innerHTML = textFinal;
  }

  useEffect(() => {
    convert(posts.description ,posts._id);
  }, [posts]);

  return (
    <div className="card lg:mx-0 uk-animation-slide-bottom-small mt-4">
      {/* post header*/}
      <div className="flex justify-between items-center lg:p-4 p-2.5">
        <div className="flex flex-1 items-center space-x-4">
          <Link href={`/dashboard/profile/${posts.user._id}`}>
            <a>
              <img
                src={posts.user.profilePicture}
                className="bg-gray-200 border border-white rounded-full w-10 h-10"
              />
            </a>
          </Link>

          <div className="flex-1 font-semibold capitalize">
            <a className="text-black dark:text-gray-100 font-bold text-lg">
              {posts.user.name}
            </a>
            <div className="text-gray-500 flex items-center space-x-2 font-normal text-sm">
              {FormatTimes(posts.createdAt)}
            </div>
          </div>
        </div>
        <div>
          {me?.role === "Administrador" ? (
            <span className="badge btn-pri rounded-full">
              {posts.area[0].name}
            </span>
          ) : null}
          <span className="badge btn-secon ml-1 rounded-full">
            {posts.category.name}
          </span>
          {me?.role === "Administrador" ? (
            <>
              <a href="#">
                <i className="icon-feather-more-horizontal text-2xl rounded-full p-2 transition tree-pts" />{" "}
              </a>
              <div
                className="bg-white w-56 shadow-md mx-auto p-2 mt-12 rounded-md text-gray-500 hidden text-base  dark:bg-gray-900 dark:text-gray-100"
                uk-drop="mode: click;pos: bottom-right;animation: uk-animation-slide-bottom-small"
                style={{ border: "solid 1px #28A09C" }}
              >
                {/* options posts */}

                <Options
                  logout={logout}
                  auth={auth}
                  id={posts._id}
                  setposts={setposts}
                  dataposts={dataposts}
                ></Options>
              </div>
            </>
          ) : null}
        </div>
      </div>
      <div className="p-3 border-b dark:border-gray-700" id={`psDes${posts._id}`}></div>
      <div uk-lightbox="true">
        {posts.tipo === "image" ? (
          <Carrusel idpost={posts._id} files={posts.files}></Carrusel>
        ) : null}
        {posts.tipo === "docs" ? (
          <DocsType files={posts.files}></DocsType>
        ) : null}
        {posts.tipo === "video" ? (
          <VideoType
            key={posts.files[0].id}
            embed={posts.files[0].ruta}
          ></VideoType>
        ) : null}
      </div>
      <div className="p-4 space-y-3">
        {/* aqui va likcoment share */}
        <LikeHeader
          auth={auth}
          logout={logout}
          idpost={posts._id}
          likes={posts.likes}
          totalComments={countTotal}
          setuserLikes={setuserLikes}
          userLikes={userLikes}
          pageLikesuser={pageLikesuser}
          setpageLikesuser={setpageLikesuser}
          nextpageLiked={nextpageLiked}
        ></LikeHeader>

        {/* commentslist */}
        {datacomments.length > 0 ? (
          <div className="border-t py-2 space-y-2 dark:border-gray-600"> </div>
        ) : null}
        {datacomments?.map((data) => (
          <Comment
            data={data}
            key={data._id}
            auth={auth}
            logout={logout}
            datacomments={datacomments}
            setdatacomments={setdatacomments}
            setcountTotal={setcountTotal}
            idpost={posts._id}
          ></Comment>
        ))}
        {countTotal > datacomments.length ? (
          <div>
            <a
              className="hover:text-back-900 text-gray-600 hover:underline mt-4 poiter"
              onClick={moreComments}
            >
              <span>
                ver ({`${parseInt(countTotal - datacomments.length)}`})
                comentarios más
              </span>
            </a>
          </div>
        ) : null}

        {/* add comments */}
        <NewComment
          idpost={posts._id}
          logout={logout}
          datacomments={datacomments}
          setdatacomments={setdatacomments}
        ></NewComment>
      </div>
    </div>
  );
}
