import React, { useEffect } from "react";

import HeadEx from "./HeadEx";
import HeaderNav from "./HeaderNav";

import SideBar from "./SideBar";

export default function index({ children, messages, className, amador }) {
  useEffect(() => {
    let body = document.querySelector("body");
    if (className) {
      let body = document.querySelector("body");
      body.classList.add("is_message");
    } else {
      body.classList.remove("is_message");
    }
  }, []);
  return (
    <>
      <HeadEx></HeadEx>
      <div id="wrapper" className={className}>
        <HeaderNav></HeaderNav>
        <SideBar></SideBar>

        {messages ? (
          <div className="main_content">{children}</div>
        ) : (
          <div className="main_content">
            <div className="mcontainer">{children}</div>
          </div>
        )}
      </div>
    </>
  );
}
