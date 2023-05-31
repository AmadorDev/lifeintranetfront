
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
export default function FileAll({
  setFileData,
  fileData,
}) {
  const typeAceptDocs = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",

    "image/jpeg",
    "image/png",
    "image/jpg",
  ];
  const changeHandlerDocs = async (event) => {
    const docs = event.target.files[0];
  
    if (docs) {
      document.getElementById("selectDocs").value = "";
      if (typeAceptDocs.includes(docs?.type)) {
        if (docs.size <= process.env.DOCS_SIZE) {
            setFileData(
            { id: uuidv4(), name: docs.name, file: docs },
          );
        } else {
          toast.error("Peso max 1.5MB");
          document.getElementById("selectDocs").value = "";
          setFileData(null)
        }
      } else {
        document.getElementById("selectDocs").value = "";
        toast.error(`Archivos válidos: Pdf, Word, Excel, PowerPoint, jpg, png, jpeg`);
        setFileData(null)
      }
    } else {
      document.getElementById("selectDocs").value = "";
      setFileData(null)
    }
  };
  return (
    <input
      className="customFileDefault rounded-full bg-green-100  cursor-pointer customfileinputpost-docs text-green-600 p-2 "
      id="selectDocs"
      type="file"
     
      onChange={changeHandlerDocs}
    />
  );
}
