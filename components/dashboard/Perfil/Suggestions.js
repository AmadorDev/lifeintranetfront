import { useState } from "react";
import FormData from "form-data";
import { toast } from "react-hot-toast";

import FileAll from "../../utils/FileAll";
import { apiFileAll } from "../../../api/docsApi";

export default function Suggestions({logout}) {
  const [fileData, setFileData] = useState(null);

  const [txt, setTxt] = useState({ type: "", detail: "" });
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    
    let errors = []

    if(txt.type == '' || txt.type == null){
      errors.push("Tipo de sugerencia requerida")
    }

    if(txt.detail == '' || txt.detail == null || txt.detail.trim().toString().length  === 0){
      errors.push("Contenido de sugerencia requerida")
    }
    

    if(errors.length === 0){
      setLoading(true)
      const formData = new FormData();
      if(fileData){
        formData.append("doc", fileData.file);
      }
      formData.append("type", txt.type);
      formData.append("detail", txt.detail);
      formData.append("modo", 'sugerencia');
      try {
        let response = await apiFileAll(formData, logout );
        if(response?.status === true){
          toast.success('Sugerencia enviada correctamente')
          setTxt({ type: "", detail: "" })
          setFileData(null)
        }else{
          toast.error('Error en el proceso')
        }
      } catch (error) {
        toast.error('Error en el proceso')
      }
      setLoading(false)
    }else{
      
      errors.forEach(err => {
        toast.error(err)
      });
    }

    

  }

  return (
    <>
      <div className="card  sm-m-0 md-m-5">
        <div className="text-center border-b py-4">
          <span className="t-title c-title"> Crear Sugerencia </span>
        </div>

        <div className="p-7 space-y-5">
          <div className="form-group">
            <label className="t-sub c-title">Tipo de sugerencia</label>
            <select
              className="py-2 px-3 rounded input-c t-sub"
              value={txt.type}
              required={true}
              onChange={(e) => setTxt({ ...txt, type: e.target.value })}
              id="type"
              name="type"
            >
              <option value=""></option>
              <option value="Sugerencias">Sugerencias</option>
              <option value="Quejas">Quejas</option>
            </select>
          </div>

          <div className="form-group">
            <label className="t-sub c-title">Contenido</label>
            <textarea
              className="py-2 px-3 rounded h-32 input-c t-sub"
              id="detail"
              name="detail"
              type="text"
              value={txt.detail}
              required={true}
              onChange={(e) => setTxt({ ...txt, detail: e.target.value })}
            ></textarea>
          </div>
          <div className="form-group">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col border-4 border-dashed w-full h-32 hover:bg-gray-100 hover:border-green-600 group">
                <div className="flex flex-col items-center justify-center pt-7">
                  <FileAll
                    fileData={fileData}
                    setFileData={setFileData}
                  ></FileAll>

                  <p className=" text-sm text-gray-400 group-hover:text-green-600 pt-1 tracking-wider cursor-pointer">
                    <span>
                      {fileData ? fileData.name : "Seleccione archivo"}
                    </span>
                  </p>
                </div>
                <input type="file" className="hidden" />
              </label>
            </div>
          </div>
        </div>

        <div className="border-t flex justify-between lg:space-x-6 p-6 bg-gray-50 rounded-b-md">
          
          <button
            type="button"
            className="btn-pri text-white  py-2 px-4 rounded-full"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <span class="spinner-border spinner-border-sm mt-1 mr-1" role="status" aria-hidden="true" ></span>:null}
              Enviar
          </button>
        </div>
      </div>
    </>
  );
}
