import { BASE_PATH } from "../utils/constants";
import { authFetch } from "../utils/authFetch";

export async function apiPollAdd(logout,formData) {
  try {
    const url = `${BASE_PATH}/polls/add`;
    const params = {
      method: "POST",
    };
    params.body = formData;
    

    const result = await authFetch(url, params, logout);
    return result ? result : null;
  } catch (error) {}
}

export async function apiPollUpdate(logout,id,formData) {
  try {
    const url = `${BASE_PATH}/polls/update/`+id;
    const params = {
      method: "PUT",
    };
    params.body = formData;
    

    const result = await authFetch(url, params, logout);
    return result ? result : null;
  } catch (error) {}
}

export async function apiPoll(logout,page,q='') {
    try {
      const url = `${BASE_PATH}/polls?page=+${page}&q=${q}`;
      const params = {
        method: "GET",
      };
      const result = await authFetch(url, params, logout);
      return result ? result : null;
    } catch (error) {}
  }

  export async function apiPollDestroy(logout,id) {
    try {
      const url = `${BASE_PATH}/polls/delete/`+id;
      const params = {
        method: "DELETE",
      };
      const result = await authFetch(url, params, logout);
      return result ? result : null;
    } catch (error) {}
  }
