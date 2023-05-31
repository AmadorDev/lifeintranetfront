

import Login from "../components/auth/Login";

function Home() {
  // const socket = io("http://localhost:3001", {
  //   withCredentials: true,
  //   extraHeaders: {
  //     "custom-header-intranet": "@INTRANET09",
  //   },
  // });
  return <Login></Login>;
}
export default Home;
