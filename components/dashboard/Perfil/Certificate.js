import React, { useState, useEffect, useRef } from "react";

import FileAll from "../../utils/FileAll";
import FormData from "form-data";
import { apiCertificateAdd, apiCertificateByUser } from "../../../api/userApi";
import toast from "react-hot-toast";
import ListCertificate from "./ListCertificate";
export default function Certificate({ logout, auth }) {
  const [fileData, setFileData] = useState(null);
  const [certificates, setCertificates] = useState([]);

  const mounted = useRef(true);

  useEffect(() => {
    if (mounted.current) {
      getCertificate();
    }
    return () => {
      mounted.current = false;
    };
  }, []);

  async function getCertificate() {
    try {
      const obj = await apiCertificateByUser(logout, auth?.User_id);
      if (!mounted.current) return null;
      setCertificates(obj?.data);
    } catch (error) {}
  }

  return (
    <section className="">
      Certificados:
      <AddCertificate
        fileData={fileData}
        setFileData={setFileData}
        logout={logout}
        certificates={certificates}
        setCertificates={setCertificates}
      ></AddCertificate>
      <ListCertificate certificates={certificates}></ListCertificate>
    </section>
  );
}

function AddCertificate({ fileData, setFileData, logout,setCertificates,certificates }) {
  const formData = new FormData();
  const [dataCertificate, setDataCertificate] = useState({
    title: "",
    date_to: "",
    date_from: "",
  });
  async function addCertificado() {
    let error = [];
    if (
      dataCertificate.title === "" ||
      dataCertificate.title.toString().length === 0
    ) {
      error.push(1);
    }

    if (
      dataCertificate.date_to === "" ||
      dataCertificate.date_to.toString().length === 0
    ) {
      error.push(1);
    }
    if (
      dataCertificate.date_from === "" ||
      dataCertificate.date_from.toString().length === 0
    ) {
      error.push(1);
    }
    if (fileData === "" || fileData === null) {
      error.push(1);
    }

    if (error.length === 0) {
      formData.append("certificate", fileData.file);
      formData.append("title", dataCertificate.title);
      formData.append("date_to", dataCertificate.date_to);
      formData.append("date_from", dataCertificate.date_from);
      try {
        const resp = await apiCertificateAdd(logout, formData);
        if (resp?.msg === "OK") {
          toast.success("registrado correctamente");
          setCertificates((old)=>[...old,resp?.data])
        } else {
          toast.error("Error en el proceso");
        }
        setDataCertificate({
          title: "",
          date_to: "",
          date_from: "",
        });
        setFileData(null);
      } catch (error) {
        toast.error(error);
        setDataCertificate({
          title: "",
          date_to: "",
          date_from: "",
        });
        setFileData(null);
      }
    } else {
      toast.error("campos requeridos*");
    }
  }
  return (
    <div className="card p-4 mt-3">
      
      <form>
        <div className="row">
          <div className="form-group  col-12 col-md-4">
            <label htmlFor="title" className="form-label">
              Título
            </label>
            <input
              type="text"
              className="input-c t-sub"
              id="title"
              aria-describedby="emailHelp"
              value={dataCertificate.title}
              onChange={(e) =>
                setDataCertificate({
                  ...dataCertificate,
                  title: e.target.value,
                })
              }
            />
          </div>
          <div className="form-group  col-12 col-md-4">
            <label htmlFor="date_to" className="form-label">
              Fecha Inicio
            </label>
            <input
              type="date"
              className=" input-c t-sub"
              id="date_to"
              value={dataCertificate.date_to}
              onChange={(e) =>
                setDataCertificate({
                  ...dataCertificate,
                  date_to: e.target.value,
                })
              }
            />
          </div>
          <div className="form-group  col-12 col-md-4">
            <label htmlFor="date_from" className="form-label">
              Fecha fin
            </label>
            <input
              type="date"
              className="input-c t-sub"
              id="date_from"
              value={dataCertificate.date_from}
              onChange={(e) =>
                setDataCertificate({
                  ...dataCertificate,
                  date_from: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="form-group mt-3">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col border-4 border-dashed w-full h-32 hover:bg-gray-100 hover:border-green-600 group">
              <div className="flex flex-col items-center justify-center pt-7">
                <FileAll
                  fileData={fileData}
                  setFileData={setFileData}
                ></FileAll>

                <p className="lowercase text-sm text-gray-400 group-hover:text-green-600 pt-1 tracking-wider cursor-pointer">
                  <span>{fileData ? fileData.name : "Selecione archivo"}</span>
                </p>
              </div>
              <input type="file" className="hidden" />
            </label>
          </div>
        </div>

        <button
          type="button"
          className="btn-pri text-white  py-2 px-4 rounded-full"
          onClick={addCertificado}
        >
          Registrar
        </button>
      </form>
    </div>
  );
}
