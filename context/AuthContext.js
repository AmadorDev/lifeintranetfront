import { createContext } from "react";
const AuthContext = createContext({
  auth: undefined,
  me: [],
  login: () => null,
  logout: () => null,
  setReloadUser: () => null,
  chat: undefined,
  chatbox: () => null,
});

export default AuthContext;
