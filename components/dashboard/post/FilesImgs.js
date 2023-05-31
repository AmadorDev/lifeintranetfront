import React from "react";
import Files from "react-files";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
export default function FilesImgs({
  setfilesdata,
  filesdata,
  seticonVideo,
  seticonDoc,
}) {
  function onFilesChange(files) {
    seticonDoc(false);
    seticonVideo(false);
    if (files[0]) {
      setfilesdata([
        ...filesdata,
        { id: uuidv4(), url: files[0].preview.url, file: files[0] },
      ]);
    }
  }

  function onFilesError(error, file) {
    toast.error(process.env.MSG_FILES);
  }
  return (
    <div className="files">
      <Files
        className="files-dropzone"
        onChange={onFilesChange}
        onError={onFilesError}
        accepts={["image/*"]}
        multiple
        maxFileSize={process.env.IMG_SIZE}
        minFileSize={0}
        clickable
      >
        <svg
          className="bg-blue-100 h-9 p-1.5 rounded-full text-blue-600 w-9 cursor-pointer"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {" "}
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </Files>
    </div>
  );
}
