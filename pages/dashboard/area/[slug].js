import React, { useEffect, useMemo, useState, useRef } from "react";

import useAuth from "../../../hooks/useAuth";
import Container from "../../../components/base";
import Posts from "../../../components/dashbord/post";
import LoaderSimple from "../../../components/utils/LoaderSimple";
import LateralTres from "../../../components/dashbord/LateralTres";

export default function detalle() {
  const { auth, me, logout } = useAuth();
  const [refresPost, setrefresPost] = useState(true);

  if (!auth) return location.href='/'

  return (
    <Container>
      {" "}
      <div className="lg:flex lg:space-x-5">
        {refresPost ? (
          <Posts
            logout={logout}
            auth={auth}
            setrefresPost={setrefresPost}
            me={me}
            codearea={me?.area[0].code}
          />
        ) : (
          <div className="lg:w-3/4 lg:px-5 space-y-5">
            <LoaderSimple></LoaderSimple>
          </div>
        )}
        <LateralTres></LateralTres>
      </div>
    </Container>
  );
}
