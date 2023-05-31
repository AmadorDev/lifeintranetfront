import { BASE_PATH } from "../utils/constants";
import { authFetch, authFetchMultipart } from "../utils/authFetch";

export async function postImgApi(formdata, logout) {
  try {
    const url = `${BASE_PATH}/posts`;
    const params = {
      method: "POST",
    };
    params.body = formdata;
    const result = await authFetchMultipart(url, params, logout);
    return result ? result : null;
  } catch (error) {}
}
export async function postDocsApi(formdata, logout) {
  try {
    const url = `${BASE_PATH}/posts/docs`;
    const params = {
      method: "POST",
    };
    params.body = formdata;
    const result = await authFetchMultipart(url, params, logout);
    return result ? result : null;
  } catch (error) {}
}
export async function postSimpleApi(formdata, logout) {
  try {
    const url = `${BASE_PATH}/posts/simple`;
    const params = {
      method: "POST",
    };
    params.body = formdata;
    const result = await authFetch(url, params, logout);
    return result ? result : null;
  } catch (error) {}
}
export async function postsListApi(page, logout, area, cate = "") {
  try {
    const url = `${BASE_PATH}/posts?page=${page}&area=${area}&category=${cate}`;
    const params = {
      method: "GET",
    };

    const result = await authFetch(url, params, logout);
    return result ? result : null;
  } catch (error) {}
}
// like
export async function postLikeApi(idpost, logout) {
  try {
    const url = `${BASE_PATH}/posts/${idpost}/like`;
    const params = {
      method: "PUT",
    };
    const result = await authFetch(url, params, logout);
    return result ? result : null;
  } catch (error) {}
}
export async function postUsersLikesApi(idPost, page, logout) {
  try {
    const url = `${BASE_PATH}/posts/${idPost}/users/likeds?page=${page}`;
    const params = {
      method: "GET",
    };

    const result = await authFetch(url, params, logout);
    return result ? result : null;
  } catch (error) {}
}

export async function postDestroyApi(id, logout) {
  try {
    const url = `${BASE_PATH}/posts/${id}/destroy`;
    const params = {
      method: "DELETE",
    };

    const result = await authFetch(url, params, logout);
    return result ? result : null;
  } catch (error) {}
}
