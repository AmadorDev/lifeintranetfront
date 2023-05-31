import { useState } from "react";
import toast from "react-hot-toast";
import { docApiDowloadId } from "../../api/docsApi";
export default function ListDocument({ docs, logout }) {
  const [loadingdow, setLoadingdow] = useState(false);

  async function dowloadFile(id) {
    try {
      setLoadingdow(true);
      const result = await docApiDowloadId(logout, id);
      if (result?.msg === "OK") {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.setAttribute("type", "hidden");
        a.href = "data:application-type/pdf;base64," + result?.data;
        a.download = "documento.pdf";
        a.click();
        document.body.removeChild(a);
      } else {
        toast.error(result?.msg);
      }
      setLoadingdow(false);
    } catch (error) {
      toast.error(error);
      setLoadingdow(false);
    }
  }
  return (
    <li
      className="li-bg li-css list-group-item d-flex justify-content-between align-items-start m-1 "
      key={docs.codigo}
    >
      <div className="ms-2 me-auto">
        <div className="t-title">{docs.periodo}</div>
        <span className="t-sub">{docs.descripcion}</span>
      </div>

      {loadingdow ? (
        <div
          className="spinner-border text-blue-400 h-7 w-7 align-self-center"
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        <div className="align-self-center cursor-pointer">
          <img
          className=""
            src="/imgs/dow.svg"
            alt=""
            width="25"
            onClick={() => dowloadFile(docs.codigo)}
          />
        </div>
      )}
    </li>
  );
}
