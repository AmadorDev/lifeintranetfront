import React, { useState, useRef } from "react";
import { commentAddApi } from "../../../api/commentApi";
export default function NewComment({ idpost, logout, setdatacomments }) {
  const [txt, setTxt] = useState("");
  const input = useRef();

  const handleKeyPress = async (event) => {
   // e.which;

    if (event.key === "Enter" || event.charCode === 13 || event.which == 13 || event.keyCode == 13) {
      let des = txt.replace(/ /g, "");
      if (des !== null && des != "") {
        try {
          const resp = await commentAddApi(
            idpost,
            JSON.stringify({ description: txt }),
            logout
          );
          if (resp.msg === "OK") {
            setdatacomments((old) => [ ...resp.data, ...old]);
          }
          setTxt("");
        } catch (error) {}
      } else {
        input.current.focus();
      }
    }
  };

  const sendComent=async()=>{
    let des = txt.replace(/ /g, "");
      if (des !== null && des != "") {
        try {
          const resp = await commentAddApi(
            idpost,
            JSON.stringify({ description: txt }),
            logout
          );
          if (resp.msg === "OK") {
            setdatacomments((old) => [ ...resp.data, ...old]);
          }
          setTxt("");
        } catch (error) {}
      } else {
        input.current.focus();
      }
  }

  return (
    <div className=" rounded-full relative dark:bg-gray-800 ">

      <div className="flex space-x-2">
<input
        placeholder="Comentar..."
        className=" input-c px-3"
        value={txt}
        onChange={(e) => setTxt(e.target.value)}
        onKeyPress={handleKeyPress}
        ref={input}
      />
      <button className=""  onClick={()=>sendComent()}>
       <img src='/send.svg' className="rounded-full bg-gray-100 hover:bg-gray-200 p-2 text-gray-500" width='45' height="45" he/> 
       </button>
      </div>
     

    </div>
  );
}
