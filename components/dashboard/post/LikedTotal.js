import React, { useEffect, useState } from "react";
import { postUsersLikesApi } from "../../../api/postApi";

export default function LikedTotal({
  liketotal,
  idpost,
  setuserLikes,
  userLikes,
  pageLikesuser,
  setpageLikesuser,
  nextpageLiked,
  logout,
}) {
  const removeClass = async () => {
    // let div = document.querySelector(".modal-backdrop");
    // if (div) {
    //   div.classList.remove("modal-backdrop");
    // }
    await likedataUsers(1);
    setpageLikesuser(() => 1);
    var myModal = new bootstrap.Modal(document.getElementById("viewLiked"), {
      keyboard: false,
    });
    myModal.show();
  };

  async function likedataUsers(page) {
    const resp = await postUsersLikesApi(idpost, page, logout);
    if (resp.msg === "OK") {
      setuserLikes((old) => [...old, ...resp.data]);
    }
  }

  useEffect(async () => {
    let isMounted = false;
    if (!isMounted) {
      if (pageLikesuser > 1) {
        await likedataUsers(pageLikesuser);
      }
    }

    return () => {
      isMounted = true;
    };
  }, [pageLikesuser]);

  return (
    <>
      {liketotal > 0 ? (
        <div
          className="flex items-center space-x-3 pt-2 poiter"
          // data-bs-toggle="modal"
          // data-bs-target="#viewLiked"
          onClick={removeClass}
        >
          {/* <div className="flex items-center">
            <img
              src="/assets/images/avatars/avatar-1.jpg"
              alt=""
              className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-900"
            />
            <img
              src="/assets/images/avatars/avatar-4.jpg"
              alt=""
              className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-900 -ml-2"
            />
            <img
              src="/assets/images/avatars/avatar-2.jpg"
              alt=""
              className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-900 -ml-2"
            />
          </div> */}
          <div className="dark:text-gray-100">
            <strong> {liketotal} </strong>Me gusta(s)
          </div>
        </div>
      ) : null}
    </>
  );
}
