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
  const [banner, setBanner] = useState([{image:"http://radiantperfumes.com/assets/images/product/compound1s.jpg"}]);

  const { logout, me } = useAuth();

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

  return (
    <div>
      <div className="w-full h-">
        <Slider {...settings}>
          {banner?.map((item, index) => (
            <div className="h-full relative " key={index}>
              <img
                src={item.image}
                className="w-full h-full object-contains"
              ></img>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
