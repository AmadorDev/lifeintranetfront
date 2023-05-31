import React from "react";

export default function Carrusel({ idpost, files }) {
  return (
    <div
      id={`car${idpost}`}
      className="carousel slide"
      data-bs-ride="carousel"
      data-pause="hover"
      data-bs-interval="false"
    >
      <div className="carousel-inner">
        {files?.map((item, index) => (
          <div
            className={index === 0 ? "carousel-item active" : "carousel-item"}
            key={item.id}
          >
            <img src={item.ruta} className="d-block w-100 " />
          </div>
        ))}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target={`#car${idpost}`}
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target={`#car${idpost}`}
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}
