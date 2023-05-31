import { useState, useEffect } from "react";
import Container from "../../../components/base";


import useAuth from "../../../hooks/useAuth";
import { docApiId } from "../../../api/docsApi";
import ListDocument from "../../../components/regulation/ListDocument";

export default function dev() {
  const { logout, auth } = useAuth();

  if (!auth) return location.href='/'

  const [info, setInfo] = useState([]);

  async function getInfo() {
    try {
      const result = await docApiId(logout, 803);
      if (result?.msg == "OK") {
        setInfo(result?.data);
      }
    } catch (error) {}
  }
  useEffect(() => {
    let isMounted = false;
    if (!isMounted) {
      getInfo();
    }
    return () => {
      isMounted = true;
    };
  }, []);

  return (
    <Container>
      <ol className="list-group list-group-flush border">
        {info?.map((item, index) => (
          <ListDocument
            docs={item}
            key={item.codigo + index}
            logout={logout}
          ></ListDocument>
        ))}
      </ol>
    </Container>
  );
}
