import { BASE_PATH } from "../utils/constants";
import { authFetch } from "../utils/authFetch";

export async function categorieAddApi(data, logout) {
  try {
    const url = `${BASE_PATH}/categories/`;
    const params = {
      method: "POST",
    };
    params.body = JSON.stringify(data);

    const result = await authFetch(url, params, logout);
    return result ? result : null;
  } catch (error) {}
}
export async function categorieListApi(logout, status = "") {
  try {
    const url = `${BASE_PATH}/categories?status=${status}`;
    const params = {
      method: "GET",
    };
    const result = await authFetch(url, params, logout);
    return result ? result : null;
  } catch (error) {}
}

export async function categorieStatusApi(id, data, logout) {
  try {
    const url = `${BASE_PATH}/categories/${id}`;
    const params = {
      method: "PUT",
    };
    params.body = JSON.stringify(data);

    const result = await authFetch(url, params, logout);
    return result ? result : null;
  } catch (error) {}
}

export async function categorieEditApi(id, data, logout) {
  try {
    const url = `${BASE_PATH}/categories/${id}/edit`;
    const params = {
      method: "POST",
    };
    params.body = JSON.stringify(data);

    const result = await authFetch(url, params, logout);
    return result ? result : null;
  } catch (error) {}
}
