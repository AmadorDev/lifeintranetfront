export const BASE_PATH = process.env.URL_API;

export const BASE_HOST = process.env.API_HOST;
export const TOKEN = process.env.TOKEN;

export const toastConfig = () => {
    return {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    };
  };