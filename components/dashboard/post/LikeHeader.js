import React, { useState, useEffect } from "react";
import { postLikeApi } from "../../../api/postApi";
import LikedTotal from "./LikedTotal";

export default function LikeHeader({
  auth,
  logout,
  idpost,
  likes,
  totalComments,
  userLikes,
  setuserLikes,
  pageLikesuser,
  setpageLikesuser,
  nextpageLiked,
}) {
  const [islike, setislike] = useState(false);
  const [liketotal, setliketotal] = useState(0);
  const Likeding = async () => {
    try {
      const resp = await postLikeApi(idpost, logout);
      if (resp.msg === "OK") {
        const rs = resp.data.likes.includes(auth.User_id);
        setislike(rs);
        setliketotal(resp.data.likes.length);
      }
    } catch (error) {}
  };
  useEffect(() => {
    let isMounted = false;
    if (!isMounted) {
      islikeding();
    }
    return () => (isMounted = true);
  }, []);

  useEffect(() => {
    let isMounted = false;
    if (!isMounted) {
      setliketotal(likes.length);
    }
    return () => (isMounted = true);
  }, []);

  function islikeding() {
    const rs = likes.includes(auth.User_id);
    setislike(rs);
  }

  return (
    <div>
      <div className="flex space-x-4 lg:font-bold poiter">
        <a className="flex items-center space-x-2" onClick={Likeding}>
          {/* text-blue-400 bg-blue-100 */}
          <div
            className={
              islike
                ? "p-2 rounded-full   bg-green-100"
                : "p-2 rounded-full  "
            }
          >
            <img src="/imgs/like.svg" width="23"></img>
          </div>
          <div
            className={islike ? "text-gray-600 poiter" : "text-gray-500 poiter"}
          >
            Me gusta
          </div>
        </a>
        <a className="flex items-center space-x-2">
          <div className="p-2 rounded-full  text-gray-500">
          <img src="/imgs/coment.svg" width="23"></img>
          </div>
          <div>
            Comentarios{totalComments > 0 ? `(${totalComments})` : null}
          </div>
        </a>
        {/* <a href="#" className="flex items-center space-x-2 flex-1 justify-end">
          <div className="p-2 rounded-full  text-black lg:bg-gray-100 dark:bg-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              width={22}
              height={22}
              className="dark:text-gray-100"
            >
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
          </div>
          <div> Share</div>
        </a> */}
      </div>

      {/* likes Total */}
      <LikedTotal
        liketotal={liketotal}
        logout={logout}
        idpost={idpost}
        userLikes={userLikes}
        setuserLikes={setuserLikes}
        pageLikesuser={pageLikesuser}
        setpageLikesuser={setpageLikesuser}
        nextpageLiked={nextpageLiked}
      ></LikedTotal>
    </div>
  );
}
