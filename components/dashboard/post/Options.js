import React from "react";
import swal from "sweetalert";
import { postDestroyApi } from "../../../api/postApi";

export default function Options({ id, logout, auth, setposts, dataposts }) {
  async function removePost() {
    swal({
      title: "Estas seguro(a)?",
      text: `Una vez confirmado, ¡no podrá revertir!`,
      icon: "warning",
      buttons: true,
      buttons: {
        cancel: "Cancelar",
        ok: "OK",
      },
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        postDestroyApi(id, logout)
          .then((rs) => {
            
            const newposts = dataposts.filter((item) => item._id !== id);
            setposts((old) => newposts);
          })
          .then((err) => {});
      } else {
      }
    });
  }
  return (
    <ul className="space-y-1" >
      {/* <li>
        <a
          href="#"
          className="flex items-center px-3 py-2 hover:bg-gray-200 hover:text-gray-800 rounded-md dark:hover:bg-gray-800"
        >
          <i className="uil-share-alt mr-1" /> Share
        </a>
      </li> */}
      {/* <li>
        <a className="flex items-center px-3 py-2 hover:bg-gray-200 hover:text-gray-800 rounded-md dark:hover:bg-gray-800 poiter">
          <i className="uil-edit-alt mr-1" /> Editar
        </a>
      </li>
      <li>
        <a
          href="#"
          className="flex items-center px-3 py-2 hover:bg-gray-200 hover:text-gray-800 rounded-md dark:hover:bg-gray-800"
        >
          <i className="uil-comment-slash mr-1" />
          Comentarios
        </a>
      </li>
      <li>
        <a
          href="#"
          className="flex items-center px-3 py-2 hover:bg-gray-200 hover:text-gray-800 rounded-md dark:hover:bg-gray-800"
        >
          <i className="uil-favorite mr-1" />
          Favorito
        </a>
      </li>
      <li>
        <hr className="-mx-2 my-2 dark:border-gray-800" />
      </li> */}
      <li onClick={removePost}>
        <a className="flex items-center px-3 py-2 text-red-500 hover:bg-red-100 hover:text-red-500 rounded-md dark:hover:bg-red-600 poiter">
          <i className="uil-trash-alt mr-1 text-red-500" />
          <span className="text-red-500">Eliminar</span>
        </a>
      </li>
    </ul>
  );
}
