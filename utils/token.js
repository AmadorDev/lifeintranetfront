import { TOKEN } from "./constants";
import jwtDecode from "jwt-decode";

export function setToken(token) {
  localStorage.setItem(TOKEN, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN);
}
export function removeToken() {
  localStorage.removeItem(TOKEN);
}

export function hasExpireToken(token) {
  const tokenDecode = jwtDecode(token);
  const tokenExpire = tokenDecode.exp * 1000;
  const currenDate = new Date().getTime();
  if (currenDate > tokenExpire) {
    return true;
  }
  return false;
}
