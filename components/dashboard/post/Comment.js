import React, { useState, useEffect, useRef } from "react";
import { FormatTimes } from "../../../utils/timenow";
import {
  commentLikeApi,
  commentRemoveApi,
  commentCountApi,
} from "../../../api/commentApi";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { toast as toastFi } from "react-toastify";
import useAuth from "../../../hooks/useAuth";
import { apiUserSearch } from "../../../api/userApi";

export default function Comment({
  comment,
  handleReplySubmit,
  deleteComment,
  level = 0,
  post
}) {
  const { logout, me } = useAuth();
  const router = useRouter();
  const [countLikes, setCountLikes] = useState(comment?.likes.length);

  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [searchTimer, setSearchTimer] = useState(null);

  const [userFind, setUserFind] = useState([]);
  const inputRef = useRef(null);
  const handleReply = () => {
    setShowReplyForm(!showReplyForm);
  };

  const handleInputChange = async (event) => {
    const text = event.target.value;
    setReplyText(text);
    const lastText = text.split(" ").pop();
    if (lastText.startsWith("@")) {
      const match = text.match(/@(\w+)/);
      if (match) {
        const search = match[1];
        

        if (searchTimer) {
          clearTimeout(searchTimer);
        }
        setSearchTimer(
          setTimeout(async () => {
            const res = await apiUserSearch(logout, search);
            setUserFind(res.data);
          }, 300)
        );
      }
    } else {
      setUserFind([]);
    }
  };

  const replaceLastWord = (text, newWord) => {
    const words = text.split(" ");
    words.pop();
    words.push(newWord);
    return words.join(" ");
  };

  const handleUserClick = (user) => {
   
    const lastWord = replyText.trim().split(" ").pop();
        
    if (lastWord.startsWith("@")) {
      const newText = replaceLastWord(replyText, `@${user}. `);
      setReplyText(newText);
    } else {
      setReplyText(`${replyText} @${user}. `);
    }

    setUserFind([]);
    inputRef.current.focus();
  };

  async function likeComment() {
    try {
      const rep = await commentLikeApi(comment._id, comment.commentId, logout);
      console.log(rep);
      if (rep.msg === "OK") {
        setCountLikes(rep.data.likes.length);
      }
    } catch (error) {}
  }

  function viewProfile() {
    router.push(`/dashboard/profile/${comment?.user._id}`);
  }

  function cancelToast(t) {
    toastFi.dismiss();
  }

  const showConfirmation = () => {
    toastFi(
      <div>
        <p className="">¿Estás seguro de que deseas continuar?</p>
        <div className="mt-2">
          <button
            onClick={() => deleteComment(comment?._id)}
            className="mx-2 btn-green text-white py-1 px-4 rounded-full"
          >
            Aceptar
          </button>
          <button
            onClick={cancelToast}
            className="btn-pri text-white py-1 px-4 rounded-full"
          >
            Cancelar
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeOnClick: true,
        draggable: false,
      }
    );
  };

  return (
    <div className="flex mb-3">
      <div className="w-10 h-10 rounded-full relative flex-shrink-0">
        <img
          onClick={viewProfile}
          src={comment.user.profilePicture}
          alt=""
          className="absolute h-full rounded-full w-full cursor-pointer"
          title="Ver profile"
        />
      </div>
      <div>
        <div className="text-gray-700 py-2 px-3 rounded-md bg-gray-100 relative lg:ml-5 ml-2 lg:mr-12  dark:bg-gray-800 dark:text-gray-100">
          <span className="t-title t-color">
            {comment.user.name} {comment.user?.surnames}    
          </span>
          <div className="t-sub t-color color-href" dangerouslySetInnerHTML={{ __html: comment?.description }}></div>
          <div className="absolute w-3 h-3 top-3 -left-1 bg-gray-100 transform rotate-45 dark:bg-gray-800" />
        </div>
        <div className="text-sm flex items-center space-x-3 mt-2 ml-5">
          <span className={"text-red-600 cursor-pointer"} onClick={likeComment}>
            <i className="uil-heart " />
            {countLikes > 0 ? `(${countLikes})` : null}
          </span>

          {level < 4 ? (
            <span
              className="cursor-pointer hover:text-blue-900"
              onClick={handleReply}
            >
              Responder 
            </span>
          ) : null}
          <span> {FormatTimes(comment.createdAt)} </span>

          <span className={"text-red-600 cursor-pointer"}>
            {me?.role === "Administrador" ? (
              <i
                className="uil-trash-alt mr-1 text-red-500"
                onClick={showConfirmation}
              />
            ) : null}
          </span>
        </div>

        {comment.replies && comment.replies.length > 0 && (
          <div className="ml-4 mt-3">
            {comment.replies.map((reply, index) => (
              <Comment
                key={index}
                comment={{ ...reply, commentId: comment.commentId }}
                deleteComment={deleteComment}
                handleReplySubmit={handleReplySubmit}
                post={post}
                level={level + 1}
              />
            ))}
          </div>
        )}
        {showReplyForm && (
          <div className=" rounded-full relative dark:bg-gray-800 mt-1 w-100 mx-2">
            <div className="flex space-x-2">
              <input
                placeholder="Comentar..."
                className=" input-c px-3"
                value={replyText}
                onChange={handleInputChange}
                ref={inputRef}
                // onChange={(e) => setReplyText(e.target.value)}
              />
              <button className="">
                <img
                  src="/send.svg"
                  className="rounded-full bg-gray-100 hover:bg-gray-200 p-2 text-gray-500"
                  width="45"
                  height="45"
                  onClick={() => {
                    handleReplySubmit({
                      id: comment.commentId,
                      answerId: comment._id,
                      answer: replyText,
                      post:post
                    });
                    setReplyText("");
                  }}
                />
              </button>
            </div>

            {userFind.length > 0 && (
              <div
                class="contact-list my-2 ml-1 border overflow-auto"
                style={{ height: 200 }}
              >
                {userFind.map((user, index) => (
                  <a
                    class="cursor-pointer"
                    key={index}
                    onClick={() => handleUserClick(user?.name)}
                  >
                    <div class="contact-avatar">
                      <img src="http://localhost:3001/users/1643720086636.png" />
                      <span class="user_status"></span>
                    </div>
                    <div class="contact-username">{user?.name} </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
