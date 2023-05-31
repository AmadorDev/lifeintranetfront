import React from "react";
import moment from "moment";
export default function ListCertificate({certificates}) {
  return (
    <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg mt-3">
      <div className="w-full overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className=" text-center  t-title t-color bg-white-500 uppercase border">
              <th className="px-5">Titulo</th>
              <th className="px-1 py-3">Fecha Inicio</th>
              <th className="px-1 py-3">Fecha Fin</th>
              <th className="px-1 py-3">Archivo</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {certificates?.map((item, index) => (
              <tr className="t-sub t-color text-center" key={index}>
                <td className="px-1 py-1 border">{item.title}</td>
                <td className="px-4 py-3 border text-sm">
                  {moment(new Date(item.date_to)).format("DD/MM/YYYY")}
                </td>
                <td className="px-4 py-3 border text-sm">
                  {moment(new Date(item.date_from)).format("DD/MM/YYYY")}
                </td>
                <td className="px-1 py-1 border text-center " width="1%">
                  <a href={item.file_url} target="_blank" className="mx-auto">
                    <img className="mx-auto" src="/imgs/dow.svg" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
