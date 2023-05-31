import { BASE_PATH } from "../utils/constants";
import { authFetch } from "../utils/authFetch";

export async function storeandupd(logout) {
  try {
    const url = `${BASE_PATH}/areas`;
    const params = {
      method: "POST",
    };

    const result = await authFetch(url, params, logout);
    return result ? result : null;
  } catch (error) {}
}

export async function list(logout) {
  try {
    const url = `${BASE_PATH}/areas`;
    const params = {
      method: "GET",
    };
    const result = await authFetch(url, params, logout);
    return result ? result : null;
  } catch (error) {}
}
