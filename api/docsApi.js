import { BASE_PATH } from "../utils/constants";
import { authFetch, authFetchMultipart } from "../utils/authFetch";

// export async function categorieAddApi(data, logout) {
//   try {
//     const url = `${BASE_PATH}/categories/`;
//     const params = {
//       method: "POST",
//     };
//     params.body = JSON.stringify(data);

//     const result = await authFetch(url, params, logout);
//     return result ? result : null;
//   } catch (error) {}
// }
export async function docListApi(logout) {
  try {
    const url = `${BASE_PATH}/docs`;
    const params = {
      method: "GET",
    };
    const result = await authFetch(url, params, logout);
    return result ? result : null;
  } catch (error) {}
}

export async function docApiId(logout, id = null) {
  try {
    const url = `${BASE_PATH}/docs/` + id;
    const params = {
      method: "GET",
    };
    const result = await authFetch(url, params, logout);
    return result ? result : null;
  } catch (error) {}
}
export async function docApiDowloadId(logout, id) {
  try {
    const url = `${BASE_PATH}/docs/dowload/` + id;
    const params = {
      method: "GET",
    };
    const result = await authFetch(url, params, logout);
    return result ? result : null;
  } catch (error) {}
}


//api send fileAll
export async function apiFileAll(formdata, logout) {
  try {
    const url = `${BASE_PATH}/docs/fileall`;
    const params = {
      method: "POST",
    };
    params.body = formdata;
    const result = await authFetchMultipart(url, params, logout);
    return result ? result : null;
  } catch (error) {}
}