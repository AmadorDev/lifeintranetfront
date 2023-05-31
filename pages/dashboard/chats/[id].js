import React from "react";
import Container from "../../../components/base";
function detalle({ users }) {
  return <Container>detalles</Container>;
}
export async function getStaticPaths() {
  const res = await fetch("https://reqres.in/api/users");
  const users = await res.json();
  const paths = users.data.map((post) => ({
    params: { id: post.id.toString() },
  }));
  return { paths, fallback: false };
}
export async function getStaticProps({ params }) {
  const res = await fetch(`https://reqres.in/api/users?id=${params.id}`);
  const users = await res.json();
  return { props: { users } };
}
export default detalle;
