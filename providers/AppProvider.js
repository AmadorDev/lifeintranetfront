import React, {
  useContext,
  createContext,
  useReducer,
  useState,
  useMemo,
} from "react";
import { apiFriend, apiHbs } from "../api/userApi";

import {
  setToken,
  getToken,
  removeToken,
  hasExpireToken,
} from "../utils/token";

import useAuth from "../hooks/useAuth";

const AppContext = createContext();

// use context
const useAppContext = () => {
  return useContext(AppContext);
};

const initialValues = {
  data_attend:{},
  docs_corp:[],
  friends: [],
  hbs: [],
  user_me: {},
  box: { receiver: {}, data: [], ventana: false },
  convId: null,
};

const reducir = (state, action) => {
  switch (action.type) {
    case "ADD_ME":
      return {
        ...state,
        user_me: action.value,
      };
    case "ADD_HBS":
      return {
        ...state,
        hbs: action.value,
      };
    case "ADD_BOX":
      return {
        ...state,
        box: action.value,
      };
    case "REMOVE_BOX":
      return {
        ...state,
        box: action.value,
      };
    case "ADD_CONV":
      return {
        ...state,
        convId: action.value,
      };
    case "REMOVE_CONV":
      return {
        ...state,
        convId: action.value,
      };
    case "ADD_FRIEND":
      return {
        ...state,
        friends: action.value,
      };
    case "ADD_ITEM_FRIEND":
      return {
        ...state,
        friends: [...state.friends, action.value],
      };
      case "REMOVE_ITEM_FRIEND":
        return {
          ...state,
          friends: state.friends.filter(item=>item._id !== action.value),
        };
      case "ADD_DOCS_CORP":
        return {
          ...state,
          docs_corp:  action.value,
        };
        case "ADD_DATA_ATTEND":
        return {
          ...state,
          data_attend:  action.value,
        };
    default:
      return state;
  }
};

function AppProvider({ children }) {
  const { logout, auth } = useAuth();
  const [state, dispatch] = useReducer(reducir, initialValues);

  const valuesProvider = {
    user_me: state.user_me,
    hbs: state.hbs,
    box: state.box,
    friends: state.friends,
    convId: state.convId,
    docs_corp:state.docs_corp,
    data_attend:state.data_attend,
    dispatch,
  };
  async function reloadDatas() {
    const token = getToken();
    if (token) {
      const expired = hasExpireToken(token);
      if (!expired) {
        const resp = await fetch(process.env.URL_API + "/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await resp.json();
        dispatch({
          type: "ADD_ME",
          value: { token: token, user: result?.data },
        });
      } else {
        logout();
      }
    } else {
      logout();
    }
  }

  async function reLoadHbs() {
    try {
      const resp = await apiHbs(logout);
      if (resp?.status === true) {
        dispatch({
          type: "ADD_HBS",
          value: resp?.data,
        });
      }
    } catch (error) {}
  }

  async function listFriend() {
    try {
      const resp = await apiFriend(logout, null);
      if (resp?.msg === "OK") {
        dispatch({
          type: "ADD_FRIEND",
          value: resp?.data[0].friends,
        });
      }
    } catch (error) {}
  }

  const values = useMemo(() => {
   
    reloadDatas(), listFriend();
    reLoadHbs();
  }, []);

  return (
    <AppContext.Provider value={valuesProvider}>{children}</AppContext.Provider>
  );
}
export { AppProvider, useAppContext };
