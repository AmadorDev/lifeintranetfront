import React from "react";
import { FiDownload, FiPlusCircle, FiTrash } from "react-icons/fi";
import useAuth from "../../../hooks/useAuth";
import ModalX from "../../utils/ModalX";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  DeleteBannerApi,
  getBannerApi,
  sliderDocApi,
} from "../../../api/managementApi";
import { useEffect } from "react";


export default function Docs() {
  const { logout, me } = useAuth();

  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [galleries, setGalleries] = useState([]);
  const [refresh, setRefresh] = useState(false);

  console.log(galleries);
  useEffect(() => {
    getGallery();
  }, []);

  const handleFileInputChange = async (event) => {
    let error = 0;
    try {
      const newFile = event.target.files[0];
      if (!newFile) {
        setImage("");
        return;
      }

      const allowedExtensions = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"];
      const fileExtension = newFile.name.split(".").pop().toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        toast.error("El archivo debe ser de tipo PDF, Word, Excel o PowerPoint");
        setImage(null);
        error += 1;
        return;
      }

      const imgSizeLimit = parseInt(process.env.IMG_SIZE);
      if (newFile.size > imgSizeLimit) {
        toast.error(
          `El documento debe tener un tamaño menor a ${
            (imgSizeLimit / 1024 / 1024).toFixed(2)
          }MB`
        );
        setImage("");
        error += 1;
      }

      if (error == 0) {
        setImage(newFile);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmit = async () => {
    if (name.trim().length === 0 || image == "") {
      toast.error("titulo  , documento son obligatorios");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("doc", image);
      formData.append("section", "marketing");
      formData.append("category", "docs");
      formData.append("name", name);
      const resp = await sliderDocApi(formData, logout);
      if (resp.status) {
        toast.success(resp.message);
        setName("");
        setImage("");
        setShow(false);
        setGalleries((olds) => [resp.data, ...olds]);
      } else {
        toast.error(resp.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getGallery = async () => {
    try {
      const resp = await getBannerApi("marketing", "docs", logout);
      if (resp.status) {
        setGalleries(resp.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const destroyBanner = async (id) => {
    if (confirm("¿Estás seguro de que deseas eliminar este elemento?")) {
      try {
        const resp = await DeleteBannerApi(id, logout);
        if (resp.status) {
          const gallery = galleries.filter((ex) => ex._id !== id);
          setGalleries(gallery);
          toast.success(resp.message);
        } else {
          toast.error(resp.message);
        }
      } catch (error) {
        toast.error(error);
      }
    } else {
    }
  };

  return (
    <>
      {" "}
      <div className="flex justify-between mt-5">
        <div className="">
          <p className="font-bold">
            DOCUMENTOS <strong>({galleries?.length})</strong>
          </p>
        </div>
        {me?.role == "Administrador" && (
          <button
            className="flex items-center bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
            onClick={() => setShow(true)}
          >
            <FiPlusCircle className="mx-1"></FiPlusCircle> Nuevo video
          </button>
        )}
      </div>
      <hr className="mt-0" />
      <div className="relative uk-slider" uk-slider="finite: true">
        <div className="uk-slider-container px-1 py-3">
          <ul
            className="uk-slider-items uk-child-width-1-4@m uk-child-width-1-3@s uk-child-width-1-2 uk-grid-small uk-grid"
            style={{ transform: "translate3d(-246px, 0px, 0px)" }}
          >
            {galleries?.map((item, index) => (
              <li className="uk-active" key={index}>
                <div className="w-full md:h-36 h-28 overflow-hidden rounded-lg relative block">
                  <div className="iframe-container">
                    <div>
                      <img src={'/imgs/doc.png'} alt="" />
                    </div>
                    {me?.role == "Administrador" && (
                      <div className="absolute top-0 right-0 m-2 cursor-pointer">
                        <span
                          className="bg-red-500 rounded-full px-2 py-1 text-white font-bold text-xs flex"
                          onClick={() => destroyBanner(item._id)}
                        >
                          <FiTrash size={20} className="" />
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 flex justify-center p-2">
                      <a
                        href={item?.image}
                        download
                        target="_blank"
                        className="bg-gray-700 rounded-full px-2 py-1 text-white font-bold text-xs cursor-pointer flex "
                      >
                        <FiDownload size={15} />{" "}
                        <span className="mx-1">DESCARGAR</span>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="pt-3">
                  <span className="font-semibold line-clamp-2">{item.name}</span>
                </div>
              </li>
            ))}
          </ul>
          <a
            className="absolute bg-white top-16 flex items-center justify-center p-2 -left-4 rounded-full shadow-md text-xl w-9 z-10 dark:bg-gray-800 dark:text-white"
            href="#"
            uk-slider-item="previous"
          >
            <i className="icon-feather-chevron-left" />
          </a>
          <a
            className="absolute bg-white top-16 flex items-center justify-center p-2 -right-4 rounded-full shadow-md text-xl w-9 z-10 dark:bg-gray-800 dark:text-white uk-invisible"
            href="#"
            uk-slider-item="next"
          >
            <i className="icon-feather-chevron-right" />
          </a>
        </div>
      </div>
      <ModalX
        isOpen={show}
        setIsOpen={setShow}
        footer={true}
        title="Registro documentos"
        onSubmit={onSubmit}
      >
        <div className="w-full h-full">
          <div className="line mb-2">
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
          <span className="my-2">documentos permitidos: pdf, excel, word</span>
          <div className="line mt-2">
            <input
              className="line__input"
              id="url"
              autoComplete="off"
              type="file"
              onChange={handleFileInputChange}
            />
            <span htmlFor="url" className="line__placeholder"></span>
          </div>
        </div>
      </ModalX>
    </>
  );
}
