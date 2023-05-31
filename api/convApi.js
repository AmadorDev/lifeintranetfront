import { BASE_PATH } from "../utils/constants";
import { authFetch } from "../utils/authFetch";

export async function covxDsUser(userP, userD, logout) {
  try {
    const url = `${BASE_PATH}/conversations/find/${userP}/${userD}`;
    const params = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(formdata),
    };
    const result = await authFetch(url, params, logout);
    return result ? result : null;
  } catch (error) {
   
  }
}
export async function covxUserApi(userP, logout) {
  try {
    const url = `${BASE_PATH}/conversations/${userP}`;
    const params = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(formdata),
    };
    const result = await authFetch(url, params, logout);
    return result ? result : null;
  } catch (error) {
    
  }
}

export async function messgexIdCovApi(convid, logout) {
  try {
    const url = `${BASE_PATH}/messages/${convid}`;
    const params = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(formdata),
    };
    const result = await authFetch(url, params, logout);
    return result ? result : null;
  } catch (error) {
    
  }
}

export async function getDetailsApi(convid, logout) {
  try {
    const url = `${BASE_PATH}/conversations/detalle/${convid}`;
    const params = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(formdata),
    };
    const result = await authFetch(url, params, logout);
    return result ? result : null;
  } catch (error) {
   
  }
}

export async function convMeApi(id, logout) {
  try {
    const url = `${BASE_PATH}/conversations/perszd/${id}`;
    const params = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(formdata),
    };
    const result = await authFetch(url, params, logout);
    return result ? result : null;
  } catch (error) {
   
  }
}

// MESSAGES
export async function addMessageApi(formdata, logout) {
  try {
    const url = `${BASE_PATH}/messages/store`;
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formdata),
    };
    const result = await authFetch(url, params, logout);
    return result ? result : null;
  } catch (error) {
    
  }
}
