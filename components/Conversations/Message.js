import React from "react";

export default function Messages({ message, own, sender, receiver }) {
  return (
    <>
      {/* globo */}
      <div className={own ? "message-bubble me" : "message-bubble"}>
        <div className="message-bubble-inner">
          <div className="message-avatar">
            {own ? (
              <img src={sender.profilePicture} />
            ) : (
              <img src={receiver.profilePicture} />
            )}
          </div>
          <div className="message-text">
            <p>{message.text}</p>
          </div>
        </div>
        <div className="clearfix" />
      </div>
      {/* end globo */}
    </>
  );
}
