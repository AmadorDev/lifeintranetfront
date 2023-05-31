import React from "react";

export default function LoaderSimple() {
  return (
    <div className="clearfix">
      <div className="spinner-border float-end" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
