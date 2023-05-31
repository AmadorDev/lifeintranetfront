import { useEffect, useState } from "react";
import { docApiId, docListApi } from "../../api/docsApi";
import ListDocument from "./ListDocument";

export default function ListTipoDocs({ logout }) {
  const [tipos, setTipos] = useState([]);

  const [isActive, setisActive] = useState("");
  const [notData, setNotData] = useState(undefined);

  // trae documentos
  const [info, setInfo] = useState([]);

  async function Tipos() {
    try {
      const result = await docListApi(logout);
      if (result?.msg === "OK") {
        setTipos(() => result?.data.filter((item) => item.value !== "803"));
      }
    } catch (error) {}
  }

  async function getInfo(id) {
    try {
      setisActive(id);
      const result = await docApiId(logout, id);
      if (result?.msg == "OK") {
        setInfo(result?.data);
        setNotData(result?.data.length);
      }
    } catch (error) {}
  }

  useEffect(async() => {
    let isMounted = false;
    if (!isMounted) {
      await Tipos();
      selectedLast();
    }
    return () => {
      isMounted = true;
    };
  }, []);

  function selectedLast(e){
      let item = document.querySelectorAll(".itemLink")[0];
      item.click();
  }
  
  return (
    <>
      <div className="row">
        <div className="col-12">
          <ul className="nav justify-content-center">
            {tipos?.map((item, index) => (
              <li
                className={
                  isActive === item.value
                    ? " font-bold nav-item itemLink t-title"
                    : "nav-item itemLink"
                }
                key={index}
                onClick={() => getInfo(item.value)}
              >
                <a
                  className="nav-link cursor-pointer active "
                  aria-current="page"
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-12">
          <div className="card p-2">
            {" "}
            <ol className="list-group list-group-flush">
              {info?.map((item, index) => (
                <ListDocument
                  docs={item}
                  key={item.codigo + index}
                  logout={logout}
                ></ListDocument>
              ))}
              {info.length === 0 ? (
                <li className="list-group-item text-center">---</li>
              ) : null}
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}
