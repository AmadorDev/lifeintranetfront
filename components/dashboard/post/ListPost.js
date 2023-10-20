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

import {
  commentListApi,
  commentCountApi,
  commentRemoveApi,
  commentAnswerApi,
} from "../../../api/commentApi";
import nl2br from "react-nl2br";
import toast from "react-hot-toast";
import { toast as toastF } from "react-toastify";
import { toastConfig } from "../../../utils/constants";
import { apiGetUserIdByName } from "../../../api/userApi";

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
  const [dataComments, setDataComments] = useState([]);
  const [nextPage, setnextPage] = useState(1);
  const [countTotal, setcountTotal] = useState(0);
  const [refreshComment, setRefreshComment] = useState(false);

  const FetchComment = async (page) => {
    const reps = await commentListApi(page, posts._id, logout);
    console.log("calllll", reps.data);
    if (reps.msg === "OK") {
      const dataS = dataComments.concat(reps.data);
      const newComment = Array.from(new Set(dataS.map(JSON.stringify))).map(
        JSON.parse
      );
      setDataComments(newComment);
    }
  };

  useEffect(async () => {
    let mounted = false;
    if (!mounted) {
      FetchComment(nextPage);
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

  function convert(text, id) {
    let d = document.querySelector("#psDes" + id);

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
    let textFinal = result.replace(/(?:\r\n|\r|\n)/g, "<br>");

    d.innerHTML = textFinal;
  }

  useEffect(() => {
    convert(posts.description, posts._id);
  }, [posts]);

  //comment actions----------------
  //delete comment
  async function deleteComment(commentId) {
    try {
      const resp = await commentRemoveApi(commentId, logout);
      console.log("result", resp);
      if (resp?.msg === "OK") {
        setDataComments((old) => {
          return old.filter((items) => items._id !== commentId);
        });
        toast.success("Eliminado correctamente!");
        setcountTotal((old) => parseInt(old) - 1);
      } else {
        toast.error(resp.data);
      }
    } catch (e) {
      toast.error(e);
    }
  }
  console.log("comments:", dataComments);

  function handleAddReply(prevComments, id, answerId, text) {
    return prevComments.map((comment) => {
      if (comment._id === answerId) {
        return {
          ...comment,
          replies: [...comment.replies, text],
        };
      }

      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: handleAddReply(comment.replies, id, answerId, text),
        };
      }

      return comment;
    });
  }

  function FilterAnswer(text) {
    const regex = /@(\w+\s\w+)\./;
    const match = text.match(regex);

    if (match && match.length > 1) {
      const fullName = match[1];
      return fullName;
    } else {
      return null;
    }
  }

  function FilterAnswerReplace(text, name, id) {
    const regex = new RegExp(`@${name}\\.`, "g");
    const result = text.replace(
      regex,
      `<a href="/dashboard/profile/${id}">@${name}</a>`
    );

    return result;
  }

  console.log("dataComments", dataComments);
  const handleReplySubmit = async ({ id, answerId, answer,post }) => {
    console.log("id:", id);
    console.log("answer:", answerId);
    console.log("text", answer);
    console.log("post", post);


    
    let name = FilterAnswer(answer);
    let newAnswer = answer;
    let mentioned = null;
    if (name) {
      let fd = { name };
      let getId = await apiGetUserIdByName(logout, JSON.stringify(fd));
      if (getId.data) {
        newAnswer = FilterAnswerReplace(answer, name, getId.data);
        mentioned = getId.data;
      }
    }

    let data = {
      replyId: answerId,
      answer: newAnswer,
      post:post,
      mentioned: mentioned
    };

    try {
      const resp = await commentAnswerApi(id, JSON.stringify(data), logout);
      if (resp.status) {
        const updatedItems = dataComments.map((item) => {
          if (item._id === resp?.data._id) {
            return resp.data;
          }
          return item;
        });

        setDataComments(updatedItems);
        toastF.success(resp.message);
      } else {
        toastF.error(resp.message, toastConfig);
      }
    } catch (error) {}
  };

  return (
    <div className="card lg:mx-0 uk-animation-slide-bottom-small mt-4">
      {/* post header*/}
      <div className="flex justify-between items-center lg:p-4 p-2.5">
        <div className="flex flex-1 items-center space-x-4">
          <Link href={`/dashboard/profile/${posts?.user?._id}`}>
            <a>
              <img
                src={posts?.user?.profilePicture}
                className="bg-gray-200 border border-white rounded-full w-10 h-10"
              />
            </a>
          </Link>

          <div className="flex-1 font-semibold capitalize">
            <a className="text-black dark:text-gray-100 font-bold text-lg">
              {posts?.user?.name} 
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
      <div
        className="p-3 border-b dark:border-gray-700"
        id={`psDes${posts._id}`}
      ></div>
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
        {dataComments.length > 0 ? (
          <div className="border-t py-2 space-y-2 dark:border-gray-600"> </div>
        ) : null}
        {/* {datacomments?.map((data) => (
          <Comment
            data={data}
            key={data._id}
            auth={auth}
            logout={logout}
            datacomments={datacomments}
            setDataComments={setDataComments}
            setcountTotal={setcountTotal}
            idpost={posts._id}
            handleReplySubmit={handleReplySubmit}
          ></Comment>
        ))} */}

        {dataComments &&
          dataComments.length > 0 &&
          dataComments.map((comment, index) => (
            <Comment
              key={index}
              comment={{ ...comment, commentId: comment._id }}
              post={posts._id}
              deleteComment={deleteComment}
              handleReplySubmit={handleReplySubmit}
            ></Comment>
          ))}

        {countTotal > dataComments.length ? (
          <div>
            <a
              className="hover:text-back-900 text-gray-600 hover:underline mt-4 poiter"
              onClick={moreComments}
            >
              <span>
                ver ({`${parseInt(countTotal - dataComments.length)}`})
                comentarios más 
              </span>
            </a>
          </div>
        ) : null}

        {/* add comments */}
        <NewComment
          postId={posts._id}
          logout={logout}
          setDataComments={setDataComments}
        ></NewComment>
      </div>
    </div>
  );
}
