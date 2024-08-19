import axios from "axios";
import Cookies from "js-cookie";
import { FetchOptions, User } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_CLIENT_SECRET!;

export const generateToken = async (): Promise<string> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/generate-token`,
      {},
      {
        headers: {
          "client-secret": CLIENT_SECRET,
        },
      }
    );

    const { token } = response.data;
    Cookies.set("jwt_token", token, { secure: true });

    return token;
  } catch (error) {
    console.error("Error generating JWT token:", error);
    throw error;
  }
};

export const authenticatedFetch = async (
  url: string,
  options: FetchOptions = {}
): Promise<any> => {
  const token = Cookies.get("jwt_token");

  if (!token) {
    throw new Error("No JWT token available");
  }

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

export const registerUser = async (user: User): Promise<any> => {
  try {
    const token = Cookies.get("jwt_token");

    const response = await axios.post(`${API_BASE_URL}/api/register`, user, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};
