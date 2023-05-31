import React from "react";

export default function VideoType({ embed }) {
  return (
    <div className="w-full h-full">
      <iframe
        src={`https://www.youtube.com/embed/${embed}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full  iframeClass"
       
      ></iframe>
    </div>
  );
}
