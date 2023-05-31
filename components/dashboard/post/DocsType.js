import Link from "next/link";
import React from "react";

export default function DocsType({ files }) {
  return (
    <ol className="list-group p-2">
      {files?.map((it) => (
        <li
          className="list-group-item d-flex justify-content-between align-items-start"
          key={it.id}
        >
          <div className="ms-2 me-auto">{it.name}</div>

          <span className="badge  rounded-pill poiter bg-blue-200 rounded-full">
            <form method="get" action={it.ruta} target="_blank">
              <button type="submit">
                <img
                  src="/posts/dowload.png"
                  alt="Descargar"
                  width="15"
                  title="Descargar"
                />
              </button>
            </form>
          </span>
        </li>
      ))}
    </ol>
  );
}
