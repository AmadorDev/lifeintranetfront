import React, { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import {
  FiChevronRight,
  FiFileText,
  FiPlusCircle,
  FiTrash2,
} from "react-icons/fi";
import {
  DestroyVideoExamApi,
  getVideoExamApi,
  videoExamApi,
} from "../../api/managementApi";
import useAuth from "../../hooks/useAuth";
import ModalX from "../utils/ModalX";

export default function Exams() {
  const [exams, setExams] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  const { logout, me } = useAuth();

  useEffect(() => {
    getExams();
  }, []);

  const onSubmit = async () => {
    if (name.trim().length == 0 || url.trim().length == 0) {
      toast.error("Título y url son campos obligatorios");
      return;
    }
    let data = {
      link: url,
      name: name,
      cate: "examen",
      section: "soma",
    };
    try {
      const resp = await videoExamApi(data, logout);
      if (resp.status) {
        toast.success(resp.message);
        setName("");
        setUrl("");
        setShow(false);
        setExams((olds) => [resp.data, ...olds]);
      } else {
        toast.error(resp.message);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const getExams = async () => {
    try {
      const resp = await getVideoExamApi("soma", "examen", logout);
      if (resp.status) {
        setExams(resp.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const destroyExam = async (id) => {
    if (confirm("¿Estás seguro de que deseas eliminar este elemento?")) {
      try {
        const resp = await DestroyVideoExamApi(id, logout);
        console.log(resp);
        if (resp.status) {
          const updExams = exams.filter((ex) => ex._id !== id);
          setExams(updExams);
          toast.success(resp.message);
        } else {
          toast.error(resp.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div>
      <ModalX
        isOpen={show}
        setIsOpen={setShow}
        footer={true}
        title="Registro  examen"
        onSubmit={onSubmit}
      >
        <div className="w-full h-full">
          <div className="line">
            <input
              className="line__input"
              autoComplete="off"
              type="text"
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <span htmlFor="name" className="line__placeholder">
              Titulo
            </span>
          </div>
          <div className="line my-3">
            <input
              className="line__input"
              id="url"
              autoComplete="off"
              type="text"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
            />
            <span htmlFor="url" className="line__placeholder">
              Link examen
            </span>
          </div>
        </div>
      </ModalX>

      <div className="flex justify-between mt-5">
        <div className="">
          <p className="font-bold">
            ÚLTIMOS EXAMENES <strong>({exams.length})</strong>
          </p>
        </div>
        {me?.role == "Administrador" && (
          <button
            className="flex items-center bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
            onClick={() => setShow(true)}
          >
            <FiPlusCircle className="mx-1"></FiPlusCircle> Nuevo examen
          </button>
        )}
      </div>

      <hr className="mt-0" />

      <div>
        <div className="  rounded-xl shadow shadow-slate-300 my-3">
          {exams?.map((item, index) => (
            <div className="" key={item._id + index}>
              <div className="flex cursor-pointer justify-between items-center border-b border-slate-200 py-2 px-2   bg-gradient-to-r from-transparent to-transparent hover:from-slate-100 transition ease-linear duration-150">
                <div className="inline-flex items-center space-x-2">
                  <div>
                    <FiFileText className="w-4 h-4 text-slate-500 hover:text-indigo-600 hover:cursor-pointer"></FiFileText>
                  </div>
                  <div>{item.name}</div>
                </div>
                <div className="flex items-center">
                  <a href={item.link} target="_blank">
                    <FiChevronRight className="css-i6dzq1" size={20} />
                  </a>
                  {me?.role == "Administrador" &&<FiTrash2 onClick={() => destroyExam(item._id)} />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
