import React, { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { FiPlus, FiPlusCircle, FiTrash } from "react-icons/fi";
import {
  DestroyVideoExamApi,
  getVideoExamApi,
  videoExamApi,
} from "../../api/managementApi";
import useAuth from "../../hooks/useAuth";
import ModalX from "../utils/ModalX";

export default function Videos() {
  const [videos, setVideos] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [show, setShow] = useState(false);

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  self.addEventListener("fetch", (event) => {
    if (event.request.mode === "navigate") {
      event.respondWith(
        (async () => {
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }
          const networkResponse = await fetch(event.request);
          return networkResponse;
        })()
      );

      event.waitUntil(
        (async () => {
          const preloadResponse = await event.preloadResponse;
          if (!preloadResponse) {
            const response = await fetch(event.request);
            const cache = await caches.open("pages");
            await cache.put(event.request, response.clone());
          }
        })()
      );
    }
  });

  const { logout, me } = useAuth();

  useEffect(() => {
    getVideo();
  }, []);

  const onSubmit = async () => {
    if (name.trim().length == 0 || url.trim().length == 0) {
      toast.error("Título y url son campos obligatorios");
      return;
    }
    let data = {
      link: url,
      name: name,
      cate: "video",
      section: "soma",
    };
    try {
      const resp = await videoExamApi(data, logout);
      if (resp.status) {
        toast.success(resp.message);
        setName("");
        setUrl("");
        setShow(false);
        setVideos((olds) => [resp.data, ...olds]);
      } else {
        toast.error(resp.message);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const getVideo = async () => {
    try {
      const resp = await getVideoExamApi("soma", "video", logout);
      if (resp.status) {
        setVideos(resp.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const destroyVideo = async (id) => {
    if (confirm("¿Estás seguro de que deseas eliminar este elemento?")) {
      try {
        const resp = await DestroyVideoExamApi(id, logout);
        console.log(resp);
        if (resp.status) {
          const updatedVideos = videos.filter((video) => video._id !== id);
          setVideos(updatedVideos);
          toast.success(resp.message);
        } else {
          toast.error(resp.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  function UrlYt(url) {
    const segments = url.split("/");
    return segments[segments.length - 1];
  }

  const [embed, setEmbed] = useState("");
  function handleVideo(url) {
    setEmbed(UrlYt(url));
    setIsOpen(true);
  }

  return (
    <>
      <ModalX isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="w-full h-full">
          <iframe
            src={`https://www.youtube.com/embed/${embed}`}
            className="absolute inset-0 w-full h-full"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen=""
          />
        </div>
      </ModalX>

      <ModalX
        isOpen={show}
        setIsOpen={setShow}
        footer={true}
        title="Registro nuevo video"
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
              Link Video (YouTube)
            </span>
          </div>
        </div>
      </ModalX>

      <div className="flex justify-between">
        <div className="">
          <p className="font-bold">
            ÚLTIMOS VIDEO <strong>({videos.length})</strong>
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
            {videos?.map((item, index) => (
              <li className="uk-active" key={index}>
                <div className="w-full md:h-36 h-28 overflow-hidden rounded-lg relative block">
                  <div className="iframe-container">
                    <iframe
                      className="pointer-events-none"
                      width="100%"
                      src={`https://www.youtube.com/embed/${UrlYt(item.link)}`}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                    {me?.role == "Administrador" && (
                      <div className="absolute top-0 right-0 m-2 cursor-pointer">
                        <span
                          className="bg-red-500 rounded-full px-2 py-1 text-white font-bold text-xs "
                          onClick={() => destroyVideo(item._id)}
                        >
                          QUITAR
                        </span>
                      </div>
                    )}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <button
                        className="w-20 h-20 rounded-full bg-gray-900 hover:bg-gray-700 text-white flex items-center justify-center"
                        onClick={() => handleVideo(item.link)}
                      >
                        <IconPlay></IconPlay>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="pt-3">
                  <a className="font-semibold line-clamp-2">{item.name}</a>
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
    </>
  );
}

function IconPlay() {
  return (
    <svg
      className="w-8 h-8"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8 5.15067L18 12.0003L8 18.85V5.15067Z" fill="currentColor" />
    </svg>
  );
}
