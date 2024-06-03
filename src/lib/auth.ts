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

const SESSION_TOKEN_COOKIE_NAME = "sessionToken";

export async function getSession() {
  const authToken = getCookieValue(SESSION_TOKEN_COOKIE_NAME);

  const { data } = await http.post<SessionResponse>("/users/session", {
    token: `${authToken}`,
  });

  if (data.error) {
    throw new Error(data.message);
  }

  return data.data;
}

export async function login(payload: LoginPayload) {
  const { data } = await http.post<LoginResponse>("/users/login", payload);

  if(data.error) {
    throw new Error(data.message);
  }

  setCookie(SESSION_TOKEN_COOKIE_NAME, data.data.token, 7);
}

export function logout() {
  const authToken = getCookieValue(SESSION_TOKEN_COOKIE_NAME);
  
  if(authToken) {
    removeCookie(SESSION_TOKEN_COOKIE_NAME);
  }
}