import { useState, useRef, useEffect } from "react";
import { apiPoll } from "../../../api/pollApi";

export default function Poll({logout}) {
  const [q, setQ] = useState("");
  const [polls, setPolls] = useState([]);
  const [page, setPage] = useState(1);

  const Mounted = useRef(true);
  useEffect(() => {
    if (Mounted.current) {
      getPoll(page);
    }
    return () => {
      Mounted.current = false;
    };
  }, []);

  function FilterPoll() {
    getPoll(page);
  }

  async function PrevPage() {
    getPoll(polls?.prevPage);
  }

  async function NextPage() {
    getPoll(polls?.nextPage);
  }
  //*************list******************
  async function getPoll(page) {
    try {
      const resp = await apiPoll(logout, page, q);
      if (resp?.msg === "OK") {

        if (!Mounted.current) return null;
        setPolls(resp?.data);
      }
    } catch (error) {}
  }
  return (
    <div>
      <div className="row mt-3">
        <div className="col-8 col-md-10">
          <select
            className="py-2 px-3 rounded input-c t-sub"
            value={q}
            required={true}
            onChange={(e) => setQ(e.target.value)}
          >
            <option value=""></option>
            <option value="s">Encuesta de satisfacción</option>
            <option value="l">Encuesta de clima laboral</option>
          </select>
        </div>
        <div className="col-4 col-md-2 text-md-end">
          <button
            type="button"
            className="btn-secon text-white  py-2 px-4 rounded-full"
            onClick={() => FilterPoll()}
          >
            Filtrar
          </button>
        </div>
      </div>

      <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg mt-3">
        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className=" text-center  t-title t-color bg-white-500 uppercase border">
                <th className="px-5">Titulo</th>
                <th className="px-1 py-3">Tipo</th>
                <th className="px-1 py-3">Link</th>
               
              </tr>
            </thead>
            <tbody className="bg-white">
              {polls.docs?.map((item, index) => (
                <tr className="t-sub t-color text-center" key={index}>
                  <td className="px-3 py-1 border text-left">{item.title}</td>
                  <td className="px-1 py-1 border">{item.type_poll === 's'?'Satisfacción':'Clima Laboral'}</td>

                  <td className="px-1 py-1 border text-center font-medium text-gray-700" width="1%">
                    <a href={item.link} target="_blank" className="mx-auto  hover:underline">
                    Ver
                    </a>
                  </td>
                
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="px-5 py-2 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between">
        <span className="t-color t-sub">{polls?.totalDocs} registros</span>
        {polls?.totalDocs > 10 ? (
          <div className="inline-flex mt-2 xs:mt-0">
            <button
              className="t-title  hover:bg-gray-200 font-semibold py-2 px-4 rounded-l border"
              onClick={PrevPage}
              disabled={!polls?.prevPage}
            >
              Prev
            </button>
            <button
              className="t-title ml-1 hover:bg-gray-200  font-semibold py-2 px-4 rounded-r border"
              onClick={() => NextPage()}
              disabled={!polls?.nextPage}
            >
              Next
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
