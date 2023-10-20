import { useState, useEffect, useRef } from "react";

import swal from "sweetalert";
import {
  categorieListApi,
  categorieAddApi,
  categorieStatusApi,
  categorieEditApi,
} from "../../api/categorieApi";

import CardForm from "../dashboard/admin/CardForm";

export default function CategoryG({ logout }) {
  const [dataCates, setdataCates] = useState([]);
  const [txtCate, settxtCate] = useState("");
  const [idcate, setidcate] = useState("");

  const [isUpdated, setisUpdated] = useState(false);

  const tcate = useRef();

  const mouted = useRef(true);
  useEffect(() => {
    if (mouted.current) {
      listCate();
    }
    return () => {
      mouted.current = false;
    };
  }, []);

  async function storeCate() {
    let inputValue = txtCate.replace(/ /g, "");
    if (inputValue !== "") {
      try {
        const resp = await categorieAddApi({ name: txtCate }, logout);
        if (resp.msg === "OK") {
          
          settxtCate("");
          setdataCates((old) => [...[resp.data], ...old]);
        } else {
          swal({
            title: "",
            text: "La categoría ya existe",
            icon: "warning",
            buttons: false,
            timer: 1500,
          });
          settxtCate("");
        }
      } catch (error) {
        console.log(error);
        swal({
          title: "",
          text: process.env.MSG_ERROR,
          icon: "error",
          buttons: false,
        });
      }
    } else {
      tcate.current.focus();
    }
  }

  async function listCate() {
    try {
      const resp = await categorieListApi(logout);
      if (resp.msg === "OK") {
        if(!mouted.current)return null
        setdataCates((old) => [...resp.data, ...old]);
      }
    } catch (error) {}
  }

  function editData(id, txt) {
    settxtCate(txt);
    setisUpdated(true);
    setidcate(id);
  }
  async function updateCate() {
    let inputValue = txtCate.replace(/ /g, "");
    if (inputValue !== "") {
      try {
        const resp = await categorieEditApi(idcate, { name: txtCate }, logout);
        if (resp.msg === "OK") {
          let objIndex = dataCates.findIndex(
            (obj) => obj._id === resp.data._id
          );
          dataCates[objIndex].name = resp.data.name;
          setdataCates(dataCates);
          cancelCate();
        } else {
          swal({
            title: "",
            text: "La categoría ya existe",
            icon: "warning",
            buttons: false,
            timer: 2000,
          });
        }
      } catch (error) {
        swal({
          title: "",
          text: process.env.MSG_ERROR,
          icon: "error",
          buttons: false,
          timer: 2000,
        });
      }
    } else {
      tcate.current.focus();
    }
  }
  function cancelCate() {
    settxtCate("");
    setidcate("");
    setisUpdated(false);
  }

  async function statusCate(e, id) {
    let isChecked = e.target.checked;
    e.target.checked = !isChecked;
    swal({
      title: "Estas seguro(a)?",
      text: `Una vez confirmado, ¡no podrá revertir!`,
      icon: "warning",
      buttons: true,
      buttons: {
        cancel: "Cancelar",
        ok: "Ok",
      },
    }).then((willDelete) => {
      if (willDelete) {
        categorieStatusApi(id, { status: isChecked }, logout).then((rs) => {
          let objIndex = dataCates.findIndex((obj) => obj._id === rs.data._id);
          dataCates[objIndex].status = rs.data.status;
          e.target.checked = rs.data.status;
          setdataCates(dataCates);
        });
      } else {
        e.target.checked = !isChecked;
      }
    });
  }
  function replacesSTR(txt) {
    let result = txt.replace(/_/g, " ");
    // let result = txt.replace(/\s+/g, "_");
    return result.charAt(0).toUpperCase() + result.slice(1);
    // return result.charAt(0).toUpperCase();
  }

  return (
    <div className="row">
      <div className="col-12 col-md-6">
        <CardForm>
          <div className="grid">
            <div>
              <input
                ref={tcate}
                type="text"
                placeholder="nombre de categoría"
                className="shadow-none with-border"
                value={txtCate}
                onChange={(e) => settxtCate(e.target.value)}
              />
            </div>
          </div>
          <div className="bg-gray-10 pt-3 flex justify-end space-x-3">
            <button
              className="btn-secon text-white py-2 px-4 rounded-full"
              onClick={cancelCate}
            >
              Cancelar
            </button>
            {!isUpdated ? (
              <button
                type="button"
                className="btn-pri text-white py-2 px-4 rounded-full"
                onClick={storeCate}
              >
                Guardar
              </button>
            ) : (
              <button
                type="button"
                className="btn-pri text-white py-2 px-4 rounded-full"
                onClick={updateCate}
              >
                Actualizar
              </button>
            )}
          </div>
        </CardForm>
      </div>
      <div className="col-12 col-md-6 mt-3 md:mt-0">
        <CardForm>
          {dataCates?.map((it) => (
            <div className="space-y-5 my-2" key={it._id}>
              <div className="flex justify-between items-center">
                <div className="poiter">
                  <h4 onClick={() => editData(it._id, it.name)}>
                    {replacesSTR(it.name)}
                  </h4>
                  {/* <div>{it.status ? "activo" : "inactivo"}</div> */}
                </div>
                <div className="switches-list -mt-8 is-large">
                  <div className="switch-container">
                    <label className="switch">
                      <input
                        type="checkbox"
                        onClick={(e) => statusCate(e, it._id)}
                        defaultChecked={it.status ? true : false}
                      />
                      <span className="switch-button" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardForm>
      </div>
    </div>
  );
}
