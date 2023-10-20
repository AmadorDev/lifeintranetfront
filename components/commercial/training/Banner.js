import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FiPlusCircle } from "react-icons/fi";
import { useState } from "react";
import ModalX from "../../utils/ModalX";
import toast from "react-hot-toast";
import {
  DeleteBannerApi,
  getBannerApi,
  sliderApi,
} from "../../../api/managementApi";
import FormData from "form-data";
import { useEffect } from "react";
import useAuth from "../../../hooks/useAuth";

export default function Banner() {
  const [show, setShow] = useState(false);
  const [banner, setBanner] = useState([]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState("");

  const { logout, me } = useAuth();

  useEffect(() => {
    getBanner();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 2500,
    cssEase: "ease-in-out",
  };

  const onSubmit = async () => {
    if (name.trim().length === 0 || image == "") {
      toast.error("titulo  , imagen son obligatorios");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("cover", image);
      formData.append("section", "trainings");
      formData.append("category", "slider");
      const resp = await sliderApi(formData, logout);
      if (resp.status) {
        toast.success(resp.message);
        setName("");
        setImage("");
        setShow(false);
        setBanner((olds) => [resp.data, ...olds]);
      } else {
        toast.error(resp.message);
      }
    } catch (error) {}
  };

  //validate input file
  const handleFileInputChange = async (event) => {
    let error = 0;
    try {
      const newFile = event.target.files[0];
      if (!newFile) {
        setImage("");
        return;
      }

      const allowedExtensions = ["jpg", "jpeg", "png"];
      const fileExtension = newFile.name.split(".").pop();
      if (!allowedExtensions.includes(fileExtension)) {
        toast.error("La imagen debe ser de tipo JPG, JPEG o PNG");
        setImage("");
        error += 1;
      }

      const imgSizeLimit = parseInt(process.env.IMG_SIZE);
      if (newFile.size > imgSizeLimit) {
        toast.error(
          `La imagen debe tener un tamaño menor a ${
            imgSizeLimit / 1024 / 1024
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

  const getBanner = async () => {
    try {
      const resp = await getBannerApi("trainings","slider", logout);
      if (resp.status) {
        setBanner(resp.data);
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
          const updBanner = banner.filter((ex) => ex._id !== id);
          setBanner(updBanner);
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
    <div>
      <ModalX
        isOpen={show}
        setIsOpen={setShow}
        footer={true}
        title="Registro  banner"
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
          <span className="my-2">Medida banner : 1248px - 698px</span>
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

      {me?.role == "Administrador" && (
        <div className="flex justify-between">
          <div className=""></div>
          <button
            className="flex items-center bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
            onClick={() => setShow(true)}
          >
            <FiPlusCircle className="mx-1"></FiPlusCircle> Nuevo banner
          </button>
        </div>
      )}
      <hr className="mt-0" />

      <div className="w-full h-">
        <Slider {...settings}>
          {banner?.map((item, index) => (
            <div className="h-full relative " key={index}>
              <img
                src={item.image}
                className="w-full h-full object-contains"
              ></img>
              {me?.role == "Administrador" && (
                <div className="absolute top-0 right-0 m-2 p-1">
                  <span
                    className="bg-red-500 rounded-full px-2 py-1 text-white font-bold text-xs cursor-pointer"
                    onClick={() => destroyBanner(item._id)}
                  >
                    QUITAR
                  </span>
                </div>
              )}
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
