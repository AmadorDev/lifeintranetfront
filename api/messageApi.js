import { BASE_PATH } from "../utils/constants";
import { authFetch } from "../utils/authFetch";

export async function messagesApi(idcv, iduser, logout) {
  try {
    const url = `${BASE_PATH}/messages/${idcv}/${iduser}`;
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const result = await authFetch(url, params, logout);
    return result ? result : null;
  } catch (error) {}
}
export async function messagesupdApi(id, logout) {
  try {
    const url = `${BASE_PATH}/messages/upd/${id}`;
    const params = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const result = await authFetch(url, params, logout);
    return result ? result : null;
  } catch (error) {}
}

// uploads
// imgs
export async function imagesApi(formdata, logout) {
  try {
    const url = `${BASE_PATH}/uploads/images`;
    const params = {
      method: "POST",
    };
    params.body = formdata;

    const result = await fetch(url, params, logout);
    const resp = await result.json();
    return resp ? resp : null;
  } catch (error) {
    
  }
}

export async function docsApi(formdata, logout) {
  try {
    const url = `${BASE_PATH}/uploads/docs`;
    const params = {
      method: "POST",
    };
    params.body = formdata;

    const result = await fetch(url, params, logout);
    const resp = await result.json();
    return resp ? resp : null;
  } catch (error) {
   
  }
}
