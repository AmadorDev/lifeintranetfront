import { BASE_PATH } from "../utils/constants";
import { authFetch, authFetchMultipart } from "../utils/authFetch";
export async function registerApi(formdata) {
  try {
    const url = `${BASE_PATH}/auth/local/register`;
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formdata),
    };
    const response = await fetch(url, params);
    const result = await response.json();
    return result;
  } catch (error) {
    
  }
}

export async function LoginApi(formdata) {
  try {
    const url = `${BASE_PATH}/users/sigin`;
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formdata),
    };
    
    const response = await fetch(url, params);
    const result = await response.json();
    return result;
  } catch (error) {

  }
}
export async function apiLogout(logout, id) {
  try {
    const url = `${BASE_PATH}/users/logout/${id}`;

    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const result = await authFetch(url, params, logout);
    return result ? result : null;
  } catch (error) {
    return null;
  }
}
export async function apiGetUsers(logout) {
  try {
    const url = `${BASE_PATH}/users/list`;
    const result = await authFetch(url, null, logout);
    return result ? result : null;
  } catch (error) {
    return null;
  }
}

export async function apiMeCall(logout, id) {
  try {
    const url = `${BASE_PATH}/users/detail/${id}`;
    const result = await authFetch(url, null, logout);
    return result ? result : null;
  } catch (error) {
    return null;
  }
}

export async function apiHbs(logout) {
  try {
    const url = `${BASE_PATH}/users/hbs`;
    const result = await authFetch(url, null, logout);
    return result ? result : null;
  } catch (error) {
    return null;
  }
}

export async function apiUserSearch(logout, query) {
  try {
    const url = `${BASE_PATH}/users/list/${query}`;
    const result = await authFetch(url, null, logout);
    return result ? result : null;
  } catch (error) {
    return null;
  }
}

export async function updateUserApi(iduser, formdata, logout) {
  try {
    const url = `${BASE_PATH}/users/${iduser}`;
    const params = {
      method: "PUT",
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

export async function uploadAvatarApi(iduser, formdata, logout) {
  try {
    const url = `${BASE_PATH}/users/upload/${iduser}`;
    const params = {
      method: "POST",
    };
    params.body = formdata;
    const result = await authFetchMultipart(url, params, logout);
    return result ? result : null;
  } catch (error) {}
}

export async function uploadCoverApi(logout, formdata) {
  try {
    const url = `${BASE_PATH}/users/coverpage`;
    const params = {
      method: "POST",
    };
    params.body = formdata;
    const result = await authFetchMultipart(url, params, logout);
    return result ? result : null;
  } catch (error) {}
}

// asistencia
export async function apiAttendancelist(logout) {
  try {
    const url = `${BASE_PATH}/users/attendance`;
    const result = await authFetch(url, null, logout);
    return result ? result : null;
  } catch (error) {
    return null;
  }
}
export async function apiAttendanceStore(formdata, logout) {
  try {
    const url = `${BASE_PATH}/users/attendance`;
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
    return null;
  }
}

// friends
export async function apiFriend(logout, id) {
  try {
    let url;
    if (id != null) {
      url = `${BASE_PATH}/users/friends/` + id;
    } else {
      url = `${BASE_PATH}/users/friends`;
    }
    const result = await authFetch(url, null, logout);
    return result ? result : null;
  } catch (error) {
    return null;
  }
}

export async function apiFriendxId(logout, id) {
  try {
    const url = `${BASE_PATH}/users/friends/` + id;
    const result = await authFetch(url, null, logout);
    return result ? result : null;
  } catch (error) {
    return null;
  }
}

export async function apiFriendVerify(logout, id) {
  try {
    const url = `${BASE_PATH}/users/friends/verify/` + id;
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const result = await authFetch(url, params, logout);
    return result ? result : null;
  } catch (error) {
    return null;
  }
}

export async function apiFriendAdd(logout, formdata) {
  try {
    const url = `${BASE_PATH}/users/friends`;
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
    return null;
  }
}
export async function apiFriendRemove(logout, id) {
  try {
    const url = `${BASE_PATH}/users/friends/`+id;
    const params = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      
    };
    const result = await authFetch(url, params, logout);
    return result ? result : null;
  } catch (error) {
    return null;
  }
}


export async function apiaddEmergency(logout,formdata) {
  try {
    const url = `${BASE_PATH}/users/emergency/add`;
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
    return null;
  }
}
export async function apiEmergency(logout,uk='') {
  try {
    const url = `${BASE_PATH}/users/emergency?uk=`+uk;
    const params = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },

    };
    const result = await authFetch(url, params, logout);
    return result ? result : null;
  } catch (error) {
    return null;
  }
}


//**************************** certificates********************/
export async function apiCertificateAdd(logout, formdata) {
  try {
    const url = `${BASE_PATH}/users/certificates/add`;
    const params = {
      method: "POST",
    };
    params.body = formdata;
    const result = await authFetchMultipart(url, params, logout);
    return result ? result : null;
  } catch (error) {}
}


export async function apiCertificateByUser(logout, userId) {
  try {
    const url = `${BASE_PATH}/users/certificates/`+userId;
    const params = {
      method: "GET",
    };
    const result = await authFetch(url, params, logout);
    return result ? result : null;
  } catch (error) {}
}