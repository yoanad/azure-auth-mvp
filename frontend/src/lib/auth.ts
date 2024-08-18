import axios from "axios";
import Cookies from "js-cookie";
import {
  AuthResponse,
  FetchOptions,
  JwtPayload,
  RefreshResponse,
  User,
} from "../types";
import { jwtDecode } from "jwt-decode";

const AZURE_AUTH_URL = process.env.NEXT_PUBLIC_AZURE_AUTH_URL!;
const CLIENT_ID = process.env.NEXT_PUBLIC_AZURE_CLIENT_ID!;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_AZURE_CLIENT_SECRET!;
const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI!;
const SCOPE = process.env.NEXT_PUBLIC_AZURE_CLIENT_PERMISSION_SCOPE!;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export const getAccessToken = async (): Promise<string> => {
  try {
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      scope: SCOPE,
      redirect_uri: REDIRECT_URI,
      grant_type: "client_credentials",
      client_secret: CLIENT_SECRET,
    });

    const response = await axios.post<AuthResponse>(AZURE_AUTH_URL, params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const { access_token, refresh_token } = response.data;
    Cookies.set("access_token", access_token, { secure: true });
    if (refresh_token) {
      Cookies.set("refresh_token", refresh_token, { secure: true });
    }
    return access_token;
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw error;
  }
};

export const getToken = async (): Promise<string> => {
  let token = Cookies.get("access_token");

  if (!token) {
    return await getAccessToken();
  }

  const tokenExpires = (token: string): boolean => {
    const decodedToken = jwtDecode<JwtPayload>(token);
    const currentTime = Math.floor(Date.now() / 1000);

    return decodedToken.exp < currentTime;
  };

  if (tokenExpires(token)) {
    token = await refreshAccessToken();
  }

  return token;
};

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = Cookies.get("refresh_token");
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await axios.post<RefreshResponse>("/api/token/refresh", {
      refresh_token: refreshToken,
    });

    const { access_token } = response.data;
    Cookies.set("access_token", access_token, { secure: true });
    return access_token;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error;
  }
};

export const authenticatedFetch = async (
  url: string,
  options: FetchOptions = {}
): Promise<any> => {
  const token = await getToken();
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const registerUser = async (user: User) => {
  try {
    const response = await axios.post("/api/register", user);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};
