import { BASE_PATH } from "../utils/constants";
import { authFetch, authFetchMultipart } from "../utils/authFetch";

export async function commentAddApi(idPost, data, logout) {
  try {
    const url = `${BASE_PATH}/comments/` + idPost;
    const params = {
      method: "POST",
    };
    params.body = data;
  
    const result = await authFetch(url, params, logout);
 

    return result ? result : null;
  } catch (error) {}
}

export async function commentRemoveApi(id, logout) {
  try {
    const url = `${BASE_PATH}/comments/` + id;
    const params = {
      method: "DELETE",
    };

    const result = await authFetch(url, params, logout);
    return result ? result : null;
  } catch (error) {}
}

export async function commentListApi(page, idPost, logout) {
  try {
    const url = `${BASE_PATH}/comments/${idPost}?page=${page}`;
    const params = {
      method: "GET",
    };

    const result = await authFetch(url, params, logout);
    return result ? result : null;
  } catch (error) {}
}

export async function commentCountApi(idPost, logout) {
  try {
    const url = `${BASE_PATH}/comments/${idPost}/count`;
    const params = {
      method: "GET",
    };

    const result = await authFetch(url, params, logout);
    return result ? result : null;
  } catch (error) {}
}
export async function commentLikeApi(idComment, logout) {
  try {
    const url = `${BASE_PATH}/comments/${idComment}/like`;
    const params = {
      method: "GET",
    };

    const result = await authFetch(url, params, logout);
    return result ? result : null;
  } catch (error) {}
}
