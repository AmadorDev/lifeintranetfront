import React from "react";

export default function Messagebox({ message, own, receiver, sender }) {
  
  return (
    <div className={own ? "message-bubble me" : "message-bubble "}>
      <div className="message-bubble-inner">
        <div className="message-avatar">
          {own ? (
            <img src={sender?.profilePicture} />
          ) : (
            <img src={receiver?.profilePicture} />
          )}
        </div>
        <div className="message-text">
          {message.text_type === "text" ? (
            <p>{message.text}</p>
          ) : (
            <p>
              <a href={message.text} target="_blank">
                <img
                  src={`/chatf/${message.text_type}.svg`}
                  alt=""
                  className="iconViechat"
                />
              </a>
            </p>
          )}
        </div>
      </div>
      <div className="clearfix" />
    </div>
  );
}
