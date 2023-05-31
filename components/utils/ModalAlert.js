import React from "react";

export default function ModalAlert({ id, children, estils }) {
  return (
    <div
      className="modal fade"
      id={id}
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex={-1}
      aria-labelledby={`label${id}`}
      aria-hidden="true"
    >
      <div className={`modal-dialog ${estils}`}>
        <div className="modal-content">
          <div className="modal-body m-0 p-1">
            <div className="bg-teal-100 border-t-4 border-yellow-500 rounded-b  px-2 py-3 shadow-md">
              <div className="flex">
                <div className="py-1 text-yellow-500">
                  <svg
                    className="fill-current h-6 w-6 text-teal-500 mr-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold">Estas seguro de </p>
                  <p className="text-sm">
                    Make sure you know how these changes affect you.
                  </p>
                </div>
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
