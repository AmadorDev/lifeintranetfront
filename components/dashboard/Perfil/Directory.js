import React from "react";

export default function Directory() {
  return (
    <div>
      <li className="li-bg li-css list-group-item d-flex justify-content-between align-items-start m-1 ">
        <div className="ms-2 me-auto">
          <div className="t-title">Correos corporativos</div>
        </div>
        <div className="align-self-center cursor-pointer hover:scale-105 transition transform duration-500">
         <a href={process.env.API_HOST + 'correos_corporativos.pdf'}  target='_blank'>
         <img  src="/imgs/dow.svg" alt="" width="25" />
         </a>
        </div>
      </li>
    </div>
  );
}
