import React from "react";
import Link from "next/link";
import Container from "../../../components/base";

function chats({ users }) {
  return (
    <Container>
      <ul>
        {users.data.map((item) => (
          <li key={item.id}>
            <Link
              href={{
                pathname: "/dashboard/chats/[id]",
                query: { id: item.id },
              }}
              scroll={false}
            >
              <a>{item.first_name}</a>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}

// This function gets called at build time
export async function getStaticProps() {
  const res = await fetch("https://reqres.in/api/users");
  const users = await res.json();

  return {
    props: {
      users,
    },
  };
}

export default chats;
