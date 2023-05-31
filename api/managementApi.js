import { authFetch, authFetchMultipart } from "../utils/authFetch";
import { BASE_PATH } from "../utils/constants";

export async function videoExamApi(data, logout) {
    try {
      const url = `${BASE_PATH}/managements/videos`;
      const params = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };
      const result = await authFetch(url, params, logout);
      return result ? result : null;
    } catch (error) {
      return null;
    }
  }

  export async function getVideoExamApi(s,c,logout=null) {
    try {
      const url = `${BASE_PATH}/managements/videos/${s}/${c}`;
      const params = {
        method: "GET",
      };
      const result = await authFetch(url, params, logout);
      return result ? result : null;
    } catch (error) {
      console.log(error)
    }
  }
  


  export async function DestroyVideoExamApi(id,logout=null) {
    try {
      const url = `${BASE_PATH}/managements/videos/${id}`;
      const params = {
        method: "DELETE",
      };
      const result = await authFetch(url, params, logout);
      return result ? result : null;
    } catch (error) {
      console.log(error)
    }
  }
  


  //register slider
  export async function sliderApi(FormData, logout) {
    try {
      const url = `${BASE_PATH}/managements/sliders`;
      const params = {
        method: "POST",
      };
      params.body = FormData;
      const result = await authFetchMultipart(url, params, logout);
      return result ? result : null;
    } catch (error) {}
  }

  //get list banner
  export async function getBannerApi(s,logout=null) {
    try {
      const url = `${BASE_PATH}/managements/sliders/${s}`;
      const params = {
        method: "GET",
      };
      const result = await authFetch(url, params, logout);
      return result ? result : null;
    } catch (error) {
      console.log(error)
    }
  }


  export async function DeleteBannerApi(id,logout=null) {
    try {
      const url = `${BASE_PATH}/managements/sliders/${id}`;
      const params = {
        method: "DELETE",
      };
      const result = await authFetch(url, params, logout);
      
      return result ? result : null;
    } catch (error) {
      console.log(result)
    }
  }