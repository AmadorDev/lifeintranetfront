import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import useAuth from "../../../hooks/useAuth";
import { useAppContext } from "../../../providers/AppProvider";

import { categorieListApi } from "../../../api/categorieApi";
import { docApiId } from "../../../api/docsApi";
import ListDocument from "../../regulation/ListDocument";
import { FiHome, FiArchive, FiLayers } from "react-icons/fi";
import SideDrop from "./SideDrop";


export default function index() {
  const { auth, logout, me } = useAuth();
  const { docs_corp, dispatch } = useAppContext();

  const router = useRouter();
  const [myarea, setMyarea] = useState(undefined);
  const [cates, setCates] = useState([]);

  const [info, setInfo] = useState([]);

  //toggle culture life
  const [isClife, setIsClife] = useState(true);
  const [styleTg, setstyleTg] = useState("hidden");

  useEffect(() => {
    let isMouted = false;
    if (!isMouted) {
      replaceString();
    }
    return () => {
      isMouted = true;
    };
  }, []);

  useEffect(() => {
    let isMouted = false;
    if (!isMouted) {
      listCates();
    }
    return () => {
      isMouted = true;
    };
  }, []);

  useEffect(() => {
    let isMounted = false;
    if (!isMounted) {
      if (docs_corp.length === 0) {
        getInfo();
      } else {
        setInfo(docs_corp);
      }
    }
    return () => {
      isMounted = true;
    };
  }, []);

  function replaceString() {
    let area = me?.area[0].name.replace(/\s+/g, "_");
    setMyarea(area.toLowerCase());
  }
  function replacesSTR(txt) {
    let result = txt.replace(/_/g, " ");
    // let result = txt.replace(/\s+/g, "_");
    return result.charAt(0).toUpperCase() + result.slice(1);
    // return result.charAt(0).toUpperCase();
  }
  async function listCates() {
    try {
      const resp = await categorieListApi(logout, true);
      if (resp.msg === "OK") {
        setCates(resp.data);
      }
    } catch (error) {}
  }

  //---list info---
  async function getInfo() {
    try {
      const result = await docApiId(logout, 803);
      if (result?.msg == "OK") {
        dispatch({
          type: "ADD_DOCS_CORP",
          value: result?.data,
        });
        setInfo(result?.data);
      }
    } catch (error) {}
  }

  return (
    <div className="sidebar">
      <div className="sidebar_header">
        <img src="/imgs/life.svg" />
        <img src="/imgs/life.svg" className="logo-icon" />
        <span
          className="btn-mobile"
          uk-toggle="target: #wrapper ; cls:  is-active"
        />
      </div>

      <div className="sidebarcontent">
        <div className="sidebar_inner" data-simplebar>
          <ul>
            <li className={router.asPath == "/dashboard" ? "active" : ""}>
              <Link href="/dashboard">
                <a>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="text-gray-600"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  <span> Inicio </span>{" "}
                </a>
              </Link>
            </li>
            <SideDrop></SideDrop>
            <li className={router.asPath == "/dashboard/ssoma" ? "active" : ""}>
              <Link href="/dashboard/ssoma">
                <a>
                  <FiLayers
                    className="text-gray-600"
                    size={15}
                    style={{ borderRadius: 0 }}
                  />
                  <span> SSoma </span>{" "}
                </a>
              </Link>
            </li>

            {me?.role === "Usuario" ? (
              <>
                <li
                  className={
                    router.asPath == `/dashboard/area/${myarea}` ? "active" : ""
                  }
                >
                  <Link href={`/dashboard/area/${myarea}`}>
                    <a>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="text-gray-600"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span> {me?.area[0].name} </span>{" "}
                    </a>
                  </Link>
                </li>

                {cates?.map((item) => (
                  <li
                    key={item._id}
                    className={
                      router.asPath == `/dashboard/cate/${item.name}`
                        ? "active"
                        : ""
                    }
                  >
                    <Link href={`/dashboard/cate/${item.name}`}>
                      <a>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="text-gray-600"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span> {replacesSTR(item.name)} </span>
                      </a>
                    </Link>
                  </li>
                ))}
              </>
            ) : null}
          </ul>

          <hr />

          <div className="footer-links">
            <p className="text-center t-title">DOCUMENTOS CORPORATIVOS</p>
            <ol className="list-group list-group-flush ">
              {info?.map((item, index) => (
                <ListDocument
                  docs={item}
                  key={item.codigo + index}
                  logout={logout}
                ></ListDocument>
              ))}
            </ol>
          </div>

          <hr />
          <p
            className="text-center t-title mt-1"
            data-bs-toggle="collapse"
            href="#collapseExample"
            role="button"
            aria-expanded="false"
            aria-controls="collapseExample"
          >
            CULTURA LIFE
          </p>

          <div className="collapse show" id="collapseExample">
            <ol className="list-group list-group-flush">
              <li className="li-bg li-css list-group-item d-flex justify-content-between align-items-start m-1">
                <div className="ms-2 me-auto">
                  <div className="t-title">Misión</div>
                  <span className="t-sub">
                    Cuidar la belleza única de cada persona en todo momento, a
                    través de productos innovadores y de alta calidad.
                  </span>
                </div>
              </li>
              <li className="li-bg li-css list-group-item d-flex justify-content-between align-items-start m-1">
                <div className="ms-2 me-auto">
                  <div className="t-title">Visión</div>
                  <span className="t-sub">
                    Liderar el mercado latinoamericano de cuidado capilar y
                    belleza a través de la innovación de productos.
                  </span>
                </div>
              </li>
              <li className="li-bg li-css list-group-item d-flex justify-content-between align-items-start m-1">
                <div className="ms-2 me-auto">
                  <div className="t-title">Propósito</div>
                  <span className="t-sub">Compartiendo cada momento.</span>
                </div>
              </li>
              <li className="li-bg li-css list-group-item d-flex justify-content-between align-items-start m-1">
                <div className="ms-2 me-auto">
                  <div className="t-title">Innovación</div>
                  <span className="t-sub">
                    Creamos productos que generan valor para nuestros clientes.
                  </span>
                </div>
              </li>
              <li className="li-bg li-css list-group-item d-flex justify-content-between align-items-start m-1">
                <div className="ms-2 me-auto">
                  <div className="t-title">Trabajo en equipo</div>
                  <span className="t-sub">
                    Equipos altamente competitivos con objetivos claros.
                  </span>
                </div>
              </li>
              <li className="li-bg li-css list-group-item d-flex justify-content-between align-items-start m-1">
                <div className="ms-2 me-auto">
                  <div className="t-title">Optimismo</div>
                  <span className="t-sub">
                    Somos positivos y generamos ambientes de trabajo adecuados
                    para nuestros colaboradores y sus familias.
                  </span>
                </div>
              </li>
              <li className="li-bg li-css list-group-item d-flex justify-content-between align-items-start m-1">
                <div className="ms-2 me-auto">
                  <div className="t-title">Honestidad</div>
                  <span className="t-sub">
                    Cumplimos con todos los estándares para llevar productos de
                    calidad a nuestros clientes.
                  </span>
                </div>
              </li>
              <li className="li-bg li-css list-group-item d-flex justify-content-between align-items-start m-1">
                <div className="ms-2 me-auto">
                  <div className="t-title">Pasión</div>
                  <span className="t-sub">
                    Apasionados por lo que hacemos, buscamos la satisfacción
                    plena de nuestros clientes.
                  </span>
                </div>
              </li>
              <li className="li-bg li-css list-group-item d-flex justify-content-between align-items-start m-1">
                <div className="ms-2 me-auto">
                  <div className="t-title">Compromiso</div>
                  <span className="t-sub">
                    Es nuestro deber cuidar la belleza única de nuestros
                    clientes.
                  </span>
                </div>
              </li>
              <li className="li-bg li-css list-group-item d-flex justify-content-between align-items-start m-1">
                <div className="ms-2 me-auto">
                  <div className="t-title">Velocidad</div>
                  <span className="t-sub">
                    Bien a la primera, con excelencia en el detalle
                  </span>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
