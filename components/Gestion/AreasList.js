import { useEffect, useState,useRef } from "react";

import { list, storeandupd } from "../../api/areaApi";

export default function AreasList({ logout }) {
  const [areas, setareas] = useState([]);
  const [reloadlist, setreloadlist] = useState(false);
  const [isloading, setisloading] = useState(false);

 const Mounted = useRef(true)

  async function listAll() {
    const resp = await list(logout);
    if (resp.msg === "OK") {
      if(!Mounted.current)return null
      setareas([...resp.data]);
    }
  }
  async function storeData() {
    setisloading(true);
    try {
      const resp = await storeandupd(logout);
      if (resp.msg === "OK") {
        setreloadlist(true);
        setisloading(false);
      }
    } catch (error) {
      setisloading(false);
    }
  }

  useEffect(() => {
    if (Mounted.current) {
      listAll();
    }
    return () => {
      Mounted.current = false;
    };
  }, [reloadlist]);

 
  return (
    <>
      <div className="p-2">
        <div className="row">
          <button
            className="btn-pri text-white py-2 px-4 rounded-full"
            onClick={storeData}
          >
            {isloading ? (
              <span
                className="spinner-border spinner-border-sm mr-1"
                role="status"
                aria-hidden="true"
              ></span>
            ) : null}
            Cargar/Actualizar
          </button>
        </div>
      </div>
      <div className="mt-2">
        <ul className="list-group">
          {areas.map((item) => (
            <li className="list-group-item " key={item._id}>
              {item.name}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
