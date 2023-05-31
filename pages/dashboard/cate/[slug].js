import React, { useEffect, useMemo, useState, useRef } from "react";

import useAuth from "../../../hooks/useAuth";
import Container from "../../../components/base";
import Posts from "../../../components/dashbord/post";
import LoaderSimple from "../../../components/utils/LoaderSimple";
import LateralTres from "../../../components/dashbord/LateralTres";

export default function detalle({ id }) {
  const { auth, me, logout } = useAuth();

  if (!auth) return location.href='/'

  const [refresPost, setrefresPost] = useState(false);
  const timeoutRef = useRef();
  const timer = useRef();
  useEffect(() => {
    timeoutRef.current = window.setTimeout(() => {
      if (refresPost) {
        setrefresPost(false);
        timer.current = window.setTimeout(() => setrefresPost(true), 500);
      } else {
        setrefresPost(true);
      }
    }, 500);
    return () => {
      window.clearTimeout(timer.current);
      window.clearTimeout(timeoutRef.current);
    };
  }, [id]);

  return (
    <Container>
      <div className="lg:flex lg:space-x-5">
        {refresPost ? (
          <Posts
            logout={logout}
            auth={auth}
            setrefresPost={setrefresPost}
            me={me}
            codearea={""}
            cateid={id}
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
export const getServerSideProps = async ({ query }) => {
  const resp = await fetch(process.env.URL_API + "/categories/" + query.slug);
  const result = await resp.json();
  if (result.data.length > 0) {
    return {
      props: { id: result.data[0]._id },
    };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: "/dashboard",
      },
      props: {},
    };
  }
};
