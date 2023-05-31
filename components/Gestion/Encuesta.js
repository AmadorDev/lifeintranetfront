import moment from "moment";
import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

import {
  apiPollAdd,
  apiPoll,
  apiPollDestroy,
  apiPollUpdate,
} from "../../api/pollApi";

export default function Encuesta({ logout }) {
  const [dataForm, setDataForm] = useState({ title: "", type: "", link: "" });
  const [loading, setloading] = useState(false);

  const [polls, setPolls] = useState([]);
  const [page, setPage] = useState(1);
  const [updateF, setUpdateF] = useState(false);

  const [q, setQ] = useState("");


  const Mounted = useRef(true);
  useEffect(() => {
    if (Mounted.current) {
      getPoll(page);
    }
    return () => {
      Mounted.current = false;
    };
  }, []);

 
  //************************data******************
  async function storeEncuesta() {
    if (!isUrl(dataForm.link)) {
      return toast.error("link inválido");
    }
    setloading(true);
    try {
      const resp = await apiPollAdd(logout, JSON.stringify(dataForm));
      if (resp?.msg === "OK") {
        console.log(resp);
        setPolls({
          ...polls,
          docs: [...polls.docs, resp.data],
          totalDocs: polls.totalDocs + 1,
        });
        toast.success("Encuesta registrado correctamente");
        setDataForm({ title: "", type: "", link: "" });
      }
      if (resp?.data.errors) {
        toast.error("campo(s) requeridos*");
      }
    } catch (error) {
      toast.error("Error en el proceso*");
      setDataForm({ title: "", type: "", link: "" });
    }
    setloading(false);
  }

  function isUrl(s) {
    var regexp =
      /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(s);
  }

  //*************list******************
  async function getPoll(page) {
    try {
      const resp = await apiPoll(logout, page,q);
      if (resp?.msg === "OK") {
        console.log(resp);
        if (!Mounted.current) return null;
        setPolls(resp?.data);
      }
    } catch (error) {}
  }

  function FilterPoll() {
    getPoll(page);
  }

  function PrevPage() {
    getPoll(polls?.prevPage);
  }

  async function NextPage() {
    getPoll(polls?.nextPage);
  }

  function editPoll(item) {
    setUpdateF(true);
    setDataForm({
      title: item.title,
      type: item.type_poll,
      link: item.link,
      id: item._id,
    });
  }

  async function updateEncuesta() {
    if (!isUrl(dataForm.link)) {
      return toast.error("link inválido");
    }
    try {
      const resp = await apiPollUpdate(
        logout,
        dataForm.id,
        JSON.stringify(dataForm)
      );
      if (resp?.msg === "OK") {
        toast.success("Actualizado correctamente");
        let newdocs = polls.docs.find((item) => item._id === dataForm.id);
        newdocs.title = dataForm.title;
        newdocs.link = dataForm.link;
        newdocs.type_poll = dataForm.type;
        console.log(newdocs);
        setPolls({ ...polls });
        setUpdateF(false);
        setDataForm({ title: "", type: "", link: "" });
      }
    } catch (error) {}
  }

  async function removePoll(id) {
    try {
      const resp = await apiPollDestroy(logout, id);
      if (resp?.msg === "OK") {
        let newdocs = polls.docs.filter((item) => item._id !== id);
        setPolls({ ...polls, docs: newdocs, totalDocs: polls.totalDocs - 1 });
      }
    } catch (error) {}
  }

  function CanceleForm() {
    setUpdateF(false);
    setDataForm({ title: "", type: "", link: "" });
  }

  return (
    <div>
      <div className="card p-3">
        <div className="text-center border-b py-4">
          <span className="t-title c-title"> Nueva Encuesta </span>
        </div>

        <div className="row mt-2">
          <div className="form-group col-12 col-md-6">
            <label className="t-sub c-title">Titulo</label>
            <input
              className="input-c"
              id="title"
              name="title"
              type="text"
              value={dataForm.title}
              required={true}
              onChange={(e) =>
                setDataForm({ ...dataForm, title: e.target.value })
              }
            ></input>
          </div>
          <div className="col-12 col-md-6 mt-3 mt-md-0">
            <div className="form-group ">
              <label className="t-sub c-title">Tipo de Encuesta</label>
              <select
                className="py-2 px-3 rounded input-c t-sub"
                value={dataForm.type}
                required={true}
                onChange={(e) =>
                  setDataForm({ ...dataForm, type: e.target.value })
                }
              >
                <option value=""></option>
                <option value="s">Encuesta de satisfacción</option>
                <option value="l">Encuesta de clima laboral</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-group mt-3">
          <label className="t-sub c-title">Link</label>
          <input
            className="input-c"
            id="link"
            name="link"
            type="text"
            value={dataForm.link}
            required={true}
            onChange={(e) => setDataForm({ ...dataForm, link: e.target.value })}
          ></input>
        </div>

        <div className="mt-3">
          {updateF ? (
            <>
              <button
                type="button"
                className="btn-pri text-white  py-2 px-4 rounded-full"
                onClick={updateEncuesta}
                disabled={loading}
              >
                {loading ? (
                  <span
                    className="spinner-border spinner-border-sm mt-1 mr-1"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : null}
                Actualizar
              </button>
              <button
                type="button"
                className="btn-secon text-white  py-2 px-4 rounded-full ml-2"
                onClick={CanceleForm}
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              type="button"
              className="btn-pri text-white  py-2 px-4 rounded-full"
              onClick={storeEncuesta}
              disabled={loading}
            >
              {loading ? (
                <span
                  className="spinner-border spinner-border-sm mt-1 mr-1"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : null}
              Registrar
            </button>
          )}
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-8 col-md-10">
          <select
            className="py-2 px-3 rounded input-c t-sub"
            value={q}
            required={true}
            onChange={(e) => setQ(e.target.value)}
          >
            <option value=""></option>
            <option value="s">Encuesta de satisfacción</option>
            <option value="l">Encuesta de clima laboral</option>
          </select>
        </div>
        <div className="col-4 col-md-2 text-md-end">
          <button
            type="button"
            className="btn-secon text-white  py-2 px-4 rounded-full"
            onClick={()=>FilterPoll()}
          >
            Filtrar
          </button>
        </div>
      </div>

      <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg mt-3">
        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className=" text-center  t-title t-color bg-white-500 uppercase border">
                <th className="px-5">Titulo</th>
                <th className="px-1 py-3">Tipo</th>
                <th className="px-1 py-3">Link</th>
                <th className="px-1 py-3">Editar | Eliminar</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {polls.docs?.map((item, index) => (
                <tr className="t-sub t-color text-center" key={index}>
                  <td className="px-3 py-1 border text-left">{item.title}</td>
                  <td className="px-1 py-1 border">{item.type_poll === 's'?'Satisfacción':'Clima Laboral'}</td>

                  <td className="px-1 py-1 border text-center font-medium text-gray-700" width="1%">
                    <a href={item.link} target="_blank" className="mx-auto  hover:underline">
                      Ver
                    </a>
                  </td>
                  <td className="px-1 py-1 border">
                    <button onClick={() => editPoll(item)}>
                      <span className="badge btn-pri rounded-full px-2">Editar</span>
                    </button>
                    <button onClick={() => removePoll(item._id)}>
                      <span className="badge rounded-full bg-red-500 ml-2">X</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="px-5 py-2 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between">
        <span className="t-color t-sub">{polls?.totalDocs} registros</span>
        {polls?.totalDocs > 10 ? (
          <div className="inline-flex mt-2 xs:mt-0">
            <button
              className="t-title  hover:bg-gray-200 font-semibold py-2 px-4 rounded-l border"
              onClick={PrevPage}
              disabled={!polls?.prevPage}
            >
              Prev
            </button>
            <button
              className="t-title ml-1 hover:bg-gray-200  font-semibold py-2 px-4 rounded-r border"
              onClick={() => NextPage()}
              disabled={!polls?.nextPage}
            >
              Next
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
