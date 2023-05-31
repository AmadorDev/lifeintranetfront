import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/router";
import Head from "next/head";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import useAuth from "../../hooks/useAuth";
import { apiFriend, LoginApi, apiHbs } from "../../api/userApi";
import { useAppContext } from "../../providers/AppProvider";
export default function Login() {
  const router = useRouter();
  const { login, auth, logout } = useAuth();
  const { dispatch } = useAppContext();
  const [Loading, setLoading] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues(),
    validationSchema: Yup.object(validationSchema()),

    onSubmit: async (data, { resetForm }) => {
      setLoading(true);
      try {
        const res = await LoginApi(data);
       
        if (res?.status) {
          login(res.token, res.data);
          dispatch({
            type: "ADD_ME",
            value: { token: res?.token, user: res?.data },
          });
          const resp = await apiFriend(logout, null);
          if (resp?.msg === "OK") {
            dispatch({
              type: "ADD_FRIEND",
              value: resp.data.length > 0 ? resp.data[0].friends : [],
            });
          }
          const result = await apiHbs(logout);
          
          if (result?.msg === "OK") {
            dispatch({
              type: "ADD_HBS",
              value: result.data.length > 0 ? result.data : [],
            });
          }

          toast.success(`Bienvenido ${res.data.name}`);
          router.push("/dashboard");
        } else {
          resetForm({});
          toast.error("El usuario/contraseña son incorrectass");
        }
      } catch (error) {
        
      }
      resetForm({});
      setLoading(false);
    },
  });
  return (
    <>
      <Head></Head>
      <div className="container-fluid bg-img">
        <div
          className="row  align-items-center justify-content-center m-0 p-0"
          style={{ height: `100vh` }}
        >
          <div className="col-11 col-md-4 p-4 logindiv">
            <form onSubmit={formik.handleSubmit}>
              <div className="row">
                <div className="col-6 mt-3">Empresa</div>
                <div className="col-6">
                  <select
                    id="company"
                    name="company"
                    className="shadow-none with-border borderselect"
                    onChange={formik.handleChange}
                    value={formik.values.company}
                  >
                    <option value="11">Corporación Life</option>
                    <option value="16">Inversiones 123</option>
                    <option value="20">Grupo kamill</option>
                  </select>
                </div>
              </div>
              <div className="row justify-content-center">
                <div className="col-12">
                  <div className="group mt-4 ">
                    <input
                      type="text"
                      id="dni"
                      name="dni"
                      className="input"
                      autoComplete="of"
                      onChange={formik.handleChange}
                      value={formik.values.dni}
                      required
                    />
                    {/* <span className="highlight" /> */}
                    <span className="bar" />
                    <label className="label">Documento de Identidad</label>
                  </div>
                  <div className="group">
                    <input
                      required
                      id="pass"
                      name="pass"
                      className="input"
                      type="password"
                      autoComplete="of"
                      onChange={formik.handleChange}
                      value={formik.values.pass}
                    />
                    {/* <span className="highlight" /> */}
                    <span className="bar" />
                    <label className="label">Contraseña</label>
                  </div>
                  <div className="row justify-content-center mb-2">
                    <div className="col-12 ">
                      <button className="login__submit" type="submit">
                        {Loading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            />
                            <span> INGRESAR</span>
                          </>
                        ) : (
                          <span>INGRESAR</span>
                        )}
                      </button>
                    
                      <p className="text-center mt-2"><span><a href={`${process.env.API_LIFE}/activar-cuenta?emp=${formik.values.company}`} className="t-color " target="_blank">Activar cuenta</a></span> | <a href={`${process.env.API_LIFE}/recupera-clave?empresa=${formik.values.company}`} target="_blank" className="t-color"><span>Ólvide mi clave</span></a></p>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
function initialValues() {
  return {
    company: "11",
    dni: "",
    pass: "",
  };
}
function validationSchema() {
  return {
    company: Yup.string().min(2).required(true),
    dni: Yup.string().min(8).required(true),
    pass: Yup.string().required(true),
  };
}
