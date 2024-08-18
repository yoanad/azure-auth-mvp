import { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/register`,
        req.body
      );
      res.status(200).json(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error registering user:",
          error.response?.data || error.message
        );
        res.status(error.response?.status || 500).json({
          message: error.response?.data?.message || "Internal Server Error",
        });
      } else {
        console.error("Unexpected error registering user:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
