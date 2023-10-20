import { getToken, hasExpireToken } from "./token";
export async function authFetch(url, params, logout) {
  const token = getToken();
  if (!token) {
    logout();
  } else {
    if (hasExpireToken(token)) {
      // token expirado
      logout();
    } else {
      const paramsTemp = {
        ...params,
        headers: {
          ...params?.headers,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
console.log('paramsTemp',paramsTemp)
      try {
        const response = await fetch(url, paramsTemp);
        const result = await response.json();
        return result;
      } catch (error) {
        
      }
    }
  }
}

export async function authFetchMultipart(url, params, logout) {
  const token = getToken();
  if (!token) {
    logout();
  } else {
    if (hasExpireToken(token)) {
      // token expirado
      logout();
    } else {
      const paramsTemp = {
        ...params,
        headers: {
          ...params?.headers,
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await fetch(url, paramsTemp);
        const result = await response.json();

        return result;
      } catch (error) {
        console.log(error);
      }
    }
  }
}
