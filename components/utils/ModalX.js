import { useEffect, useRef, useState } from "react";

export default function ModalX({
  children,
  isOpen,
  setIsOpen,
  footer = false,
  title = null,
  onSubmit
}) {
  const modalOverlayRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const modalCl = modalRef.current.classList;
    const overlayCl = modalOverlayRef.current;

    if (isOpen) {
      overlayCl.classList.remove("hidden");
      setTimeout(() => {
        modalCl.remove("opacity-0");
        modalCl.remove("-translate-y-full");
        modalCl.remove("scale-150");
      }, 100);
    } else {
      modalCl.add("-translate-y-full");
      setTimeout(() => {
        modalCl.add("opacity-0");
        modalCl.add("scale-150");
      }, 100);
      setTimeout(() => overlayCl.classList.add("hidden"), 300);
    }
  }, [isOpen]);

  return (
    <>
      <div
        ref={modalOverlayRef}
        className="hidden fixed z-50 inset-0 bg-black bg-opacity-30 h-screen w-full flex justify-center items-center md:items-center pt-10 md:pt-0"
      >
        {/* modal */}
        <div
          ref={modalRef}
          className="opacity-0 transform -translate-y-full scale-150  relative w-10/12 md:w-1/2 h-1/2 md:h-3/4 bg-white rounded shadow-lg transition-opacity transition-transform duration-300"
        >
          {/* button close */}
          <button
            style={{ zIndex: 99999 }}
            onClick={() => setIsOpen(false)}
            className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-2xl w-10 h-10 rounded-full focus:outline-none text-white"
          >
            ✗
          </button>
          {/* header */}
          {title && (
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-600">{title}</h2>
            </div>
          )}
          {/* body */}
          <div className="w-full p-3 ">{children}</div>
          {/* footer */}
          {footer && (
            <div className="absolute bottom-0 left-0 px-4 py-3 border-t border-gray-200 w-full flex justify-end items-center gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="btn-secondary text-white  py-2 px-4 rounded-full"
              >
                Cancelar
              </button>
              <button className="btn-pri text-white  py-2 px-4 rounded-full" onClick={onSubmit}>
                Guardar
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
