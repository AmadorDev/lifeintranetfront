import { useEffect, useMemo, useState, useRef } from "react";
import { apiAttendancelist, apiAttendanceStore } from "../../api/userApi";
import { useAppContext } from "../../providers/AppProvider";

export default function AttendanceC({ logout }) {
  const { data_attend, dispatch } = useAppContext();

  const [attendance, setAttendance] = useState(null);
  const [reloadEp, setReloadEp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forseUp, setForseUp] = useState(false)

  const mounted = useRef(true);

  async function getApiList() {
    try {
      const resp = await apiAttendancelist(logout);
      return resp;
    } catch (error) {}
  }
console.log("---------------",attendance)
  useEffect(() => {

    if (Object.keys(data_attend).length === 0) {
      getApiList().then((resp) => {
        if (mounted.current) {
          if (resp.msg === "OK") {
            if (!mounted.current) return null;
            setAttendance(resp.data.marcas[0]);
            dispatch({
              type: "ADD_DATA_ATTEND",
              value: { marca: resp.data.marcas[0] || null, color: "green" },
            });
          }
        }
      });
    } else {
      setAttendance(data_attend.marca);
      // setColors(data_attend.color);
    }

    return () => {
      mounted.current = false;
    };
  }, [reloadEp]);

  if (attendance === null || attendance === undefined) return <NotAttendance loading={loading} MarkerAttendance={MarkerAttendance} />;

  async function MarkerAttendance() {
    setLoading(true);
    try {
      const resp = await apiAttendanceStore({}, logout);
      if (resp.msg === "OK") {
         getApiList().then((resp) => {
          if (resp.msg === "OK") {
            setAttendance(resp.data.marcas[0]);
            dispatch({
              type: "ADD_DATA_ATTEND",
              value: { marca: resp.data.marcas[0] || null, color: "green" },
            });
          }
      });
        
      }
    } catch (error) {}
    setLoading(false);
  }
  return (
    <div className="flex justify-content-center text-center">
      <div>
        <span className="t-sub">Último registro</span>
        <p className="t-title">
          {attendance?.tipo === "E" ? (
            <span> Entrada</span>
          ) : (
            <span> Salida</span>
          )}
          , {attendance?.hora} Hrs
        </p>
        <button
          disabled={loading}
          className="btn-green text-white py-2 px-4 rounded-full"
          onClick={MarkerAttendance}
        >
          {loading ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : null}
          {!loading ? <i className="uil-clock-eight"></i> : null} Marcar{" "}
          {attendance?.tipo === "E" ? (
            <span>salida</span>
          ) : (
            <span>entrada</span>
          )}
        </button>
      </div>
    </div>
  );
}
function NotAttendance({MarkerAttendance,loading}) {
  return (
    <div className="p-2 text-center">
      <p className="text-center">No registra asistencia</p>
      <button
          disabled={loading}
          className="btn-green text-white py-2 px-4 rounded-full"
          onClick={MarkerAttendance}
        >
          {loading ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : null}
          {!loading ? <i className="uil-clock-eight"></i> : null} Marcar{" "}
            <span>Ingreso</span>
        </button>
    </div>
  );
}
