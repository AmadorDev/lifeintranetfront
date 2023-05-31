import React, { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/router";

import useAuth from "../../hooks/useAuth";
import { useAppContext } from "../../providers/AppProvider";

import Container from "../../components/base";
import Posts from "../../components/dashboard/post";

import LoaderSimple from "../../components/utils/LoaderSimple";
import LateralTres from "../../components/dashboard/LateralTres";

function index() {
  const { user_me, box } = useAppContext();
  const { auth, logout, me } = useAuth();

   
   if (!auth) return location.href='/'
   

  const router = useRouter();
  const [users, setUsers] = useState(undefined);
  const [codearea, setcodearea] = useState("feed");
  const [cateid, setcateid] = useState("");

  const [refresPost, setrefresPost] = useState(true);

  useMemo(() => {
    let mounted = false;
    if (!mounted) {
      setUsers(auth?.User_id || null);
    }
    return () => {
      mounted = true;
    };
  }, [auth]);

  if (users === undefined) return null;
  // if (!users && !auth) {
  //   router.replace("/");
  //   return null;
  // }

  return (
    <Container>
      <div className="lg:flex lg:space-x-5">
        {refresPost ? (
          <Posts
            logout={logout}
            auth={auth}
            setrefresPost={setrefresPost}
            me={me}
            codearea={codearea}
            setcodearea={setcodearea}
            cateid={cateid}
            setcateid={setcateid}
          />
        ) : (
          <div className="lg:w-3/4 lg:px-5 space-y-5">
            <LoaderSimple></LoaderSimple>
          </div>
        )}
        <LateralTres logout={logout}></LateralTres>
      </div>
    </Container>
  );
}

export default index;
