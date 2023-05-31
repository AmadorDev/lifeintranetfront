import { useState, useEffect, useRef } from "react";
import { apiEmergency } from "../../../api/userApi";

export default function ContactEmergency({ logout, id }) {
  const [emergency, setEmergency] = useState(null);

  const mounted = useRef(true);
  useEffect(() => {
    getEmergency();
    return () => {
      mounted.current = false;
    };
  }, []);


  async function getEmergency() {
    try {
      let resp = await apiEmergency(logout, id);
      if (resp?.msg === "OK" && Object.keys(resp?.data).length > 0) {
        if (!mounted.current) return null;
        setEmergency(resp?.data);
      }
    } catch (error) {
      console.log("Log:", error);
    }
  }
  return (
    <div>
      {emergency ? (
        <>
          Persona de contacto:
          <div className="w-full space-y-6">
            <div className="widget card p-3">
              <ul className="text-gray-600 space-y-3 my-3">
                <li className="flex items-center space-x-2">
                  <img
                    src="/imgs/name.svg"
                    width="25"
                    className=" flex items-center justify-center p-1 "
                  />
                  <span className="ml-1 t-sub t-color">Nombres:</span>
                  <span className="pl-1 t-title t-color">
                    {emergency?.name}
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <img
                    src="/imgs/phone.svg"
                    width="25"
                    className=" flex items-center justify-center p-1 "
                  />
                  <span className="ml-1 t-sub t-color">Teléfono:</span>
                  <span className="pl-1 t-title t-color">
                    {emergency?.phone}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
