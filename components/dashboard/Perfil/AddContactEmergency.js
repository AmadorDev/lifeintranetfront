import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

import { apiaddEmergency, apiEmergency } from "../../../api/userApi";

export default function AddContactEmergency({ logout }) {
  //set contact emergengy
  const [emergency, setEmergency] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(false);

  async function addContact() {
    setLoading(true);
    try {
      let resp = await apiaddEmergency(logout, emergency);
      if (resp?.msg === "OK") {
        toast.success("registrado correctamente");
      } else {
        toast.error(resp?.data[0].msg);
      }
    } catch (e) {
      toast.error(e);
      console.log("Log:",e);
    }
    setLoading(false);
  }

 
  const mounted = useRef(true);
  useEffect(() => {
      getEmergency();
    return () => {
      mounted.current = false;
    };
  }, []);


  async function getEmergency() {
    try {
        let resp = await apiEmergency(logout);
        if (resp?.msg === "OK" && Object.keys(resp?.data).length > 0) {
            if (!mounted.current) return null
          setEmergency({ name: resp?.data.name, phone: resp?.data.phone });
        }
      
    } catch (error) {
      console.log("Log:",error);
    }
  }

  return (
    <div className="bg-white shadow rounded-lg card p-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="border focus-within:border-blue-500 focus-within:text-blue-500 transition-all duration-500 relative rounded p-1">
          <div className="-mt-4 absolute tracking-wider px-1 uppercase text-xs">
            <p>
              <label
                htmlFor="contact_name"
                className="bg-white text-gray-600 px-1"
              >
                Persona*
              </label>
            </p>
          </div>
          <p>
            <input
              id="contact_name"
              name="contact_name"
              type="text"
              className="py-1 px-1 text-gray-900 outline-none block h-full w-full"
              value={emergency.name}
              onChange={(e) =>
                setEmergency({ ...emergency, name: e.target.value })
              }
            />
          </p>
        </div>
        <div className="border focus-within:border-blue-500 focus-within:text-blue-500 transition-all duration-500 relative rounded p-1">
          <div className="-mt-4 absolute tracking-wider px-1 uppercase text-xs">
            <p>
              <label
                htmlFor="contact_phone"
                className="bg-white text-gray-600 px-1"
              >
                Número *
              </label>
            </p>
          </div>
          <p>
            <input
              id="contact_phone"
              name="contact_phone"
              type="text"
              className="py-1 px-1 text-gray-900 outline-none block h-full w-full"
              value={emergency.phone}
              onChange={(e) =>
                setEmergency({ ...emergency, phone: e.target.value })
              }
            />
          </p>
        </div>
      </div>
      <div className="border-t mt-6 pt-3">
        <button
          className="btn-secon text-white  py-2 px-4 rounded-full"
          onClick={addContact}
          disabled={loading}
        >
          Guardar
          {loading ? (
            <span
              className="spinner-border spinner-border-sm ml-1"
              role="status"
              aria-hidden="true"
            ></span>
          ) : null}
        </button>
      </div>
    </div>
  );
}
