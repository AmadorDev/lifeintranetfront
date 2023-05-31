import React, { useState } from "react";

// components
import Container from "../../../components/base";
import CardForm from "../../../components/dashbord/admin/CardForm";
import useAuth from "../../../hooks/useAuth";

import AreasList from "../../../components/Gestion/AreasList";
import CategoryG from "../../../components/Gestion/CategoryG";
import Encuesta from "../../../components/Gestion/Encuesta";

export default function manage() {
  const { auth, logout, me } = useAuth();
  if (!auth || me?.role !== "Administrador") return (location.href = "/");

  const [now, setNow] = useState(0);

  function MenuList({ value }) {
    switch (value) {
      case 0:
        return <CategoryG logout={logout} />;
      case 1:
        return (
          <CardForm>
            <AreasList logout={logout}></AreasList>
          </CardForm>
        );
        case 2:
          return <Encuesta logout={logout} />;

      default:
        return null;
    }
  }

  return (
    <Container>
      <div className="mb-6">
        <h2 className="text-2xl t-title"> Gestión </h2>
        <nav className="responsive-nav border-b md:m-0 -mx-4">
          <ul uk-switcher="connect: #form-type; animation: uk-animation-fade">
            <li onClick={() => setNow(0)}>
              <a className="lg:px-2 cursor-pointer">Categorías</a>
            </li>
            <li onClick={() => setNow(1)}>
              <a className="lg:px-2  cursor-pointer">Áreas</a>
            </li>
            <li onClick={() => setNow(2)}>
              <a className="lg:px-2  cursor-pointer">Encuestas</a>
            </li>
            <li onClick={() => setNow(3)}>
              <a className="lg:px-2  cursor-pointer">Ssoma</a>
            </li>
          </ul>
        </nav>
      </div>
      <MenuList value={now} />
    </Container>
  );
}
