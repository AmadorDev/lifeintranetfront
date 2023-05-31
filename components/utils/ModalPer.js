import React, { useState } from "react";

export default function ModalPer({
  id,
  estils,
  title,
  children,
  btncloseAdd,
  backdrop = "static",
}) {
  return (
    <>
      {/* Modal */}
      <div
        className="modal fade"
        id={id}
        data-bs-backdrop={backdrop}
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby={`label${id}`}
        aria-hidden="true"
      >
        <div className={`modal-dialog ${estils}`}>
          <div className="modal-content">
            <div className="modal-header">
              <span
                className="t-title"
                id={`label${id}`}
              >
                {title}
              </span>
              <button
                type="button"
                className="btn-close bg-gray-100 rounded-full p-2.5 right-2"
                data-bs-dismiss="modal"
                aria-label="Close"
                ref={btncloseAdd}
              />
            </div>
            <div className="modal-body">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}

function exampleModal() {
  return (
    <button
      type="button"
      className="btn btn-primary"
      data-bs-toggle="modal"
      data-bs-target="#staticBackdrop"
    >
      Launch static backdrop modal
    </button>

    /* <ModalPer
        id="staticBackdrop"
        estils="modal-dialog-centered modal-lg"
        title="kfdsjfksdjfs"
      >
        <button>sdfsf</button>
      </ModalPer> */
  );
}
