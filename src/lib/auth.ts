import { http } from "./http";
import { getCookieValue, removeCookie, setCookie } from "./cookies";

type Session = {
  name: string;
};
type SessionResponse = BaseResponse & {
  data: Session | null;
};
type LoginPayload = {
  name: string;
  password: string;
};
type LoginResponse = BaseResponse & {
  data: {
    token: string;
  };
};

export async function getSession() {
  const authToken = getCookieValue("__Secure-sessionToken");

  const { data } = await http.post<SessionResponse>("/users/session", {
    token: `${authToken}`,
  });

  if (data.error) {
    throw new Error(data.message);
  }

  return data;
}

export async function login(payload: LoginPayload) {
  const { data } = await http.post<LoginResponse>("/users/login", payload);

  if(data.error) {
    throw new Error(data.message);
  }

  setCookie("__Secure-sessionToken", data.data.token, 7);
}

export function logout() {
  const authToken = getCookieValue("__Secure-sessionToken");
  
  if(authToken) {
    removeCookie("__Secure-sessionToken");
  }
}