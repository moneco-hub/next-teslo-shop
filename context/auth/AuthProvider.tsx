import { FC, useEffect, useReducer } from "react";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import Cookies from "js-cookie";
import axios, { AxiosError } from "axios";

import { tesloApi } from "../../api";
import { IUser } from "../../interfaces";

import { AuthContext, authReducer } from "./";

export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser;
}

const AUTH_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined,
};

interface Props {
  children: JSX.Element;
}

export const AuthProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);
  const { data, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      dispatch({ type: "[Auth] - Login", payload: data.user as IUser });
    }
  }, [status, data]);

  const loginUser = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data } = await tesloApi.post("/user/login", { email, password });
      const { token, user } = data;
      Cookies.set("token", token);
      dispatch({ type: "[Auth] - Login", payload: user });
      return true;
    } catch (error) {
      return false;
    }
  };

  const registerUser = async (
    name: string,
    email: string,
    password: string
  ): Promise<{
    hasError: boolean;
    message?: string;
  }> => {
    try {
      const { data } = await tesloApi.post("/user/register", { name, email, password });
      const { token, user } = data;
      Cookies.set("token", token);
      dispatch({ type: "[Auth] - Login", payload: user });
      return {
        hasError: false,
      };
    } catch (error: AxiosError | any) {
      if (axios.isAxiosError(error)) {
        return {
          hasError: true,
          message: (error as any).response?.data.message,
        };
      }

      return {
        hasError: true,
        message: "User can not be created - try again",
      };
    }
  };

  const logOut = () => {
    // Cookies.remove("token");
    Cookies.remove("cart");

    Cookies.remove("firstName");
    Cookies.remove("lastName");
    Cookies.remove("address");
    Cookies.remove("address2");
    Cookies.remove("zip");
    Cookies.remove("city");
    Cookies.remove("country");
    Cookies.remove("phone");

    signOut();
    // router.reload();
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,

        //Methods
        loginUser,
        registerUser,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
