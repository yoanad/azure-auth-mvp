import { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const response = await axios.get(`${API_BASE_URL}/api/secure-data`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      res.status(200).json(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error fetching secure data:",
          error.response?.data || error.message
        );
        res.status(error.response?.status || 500).json({
          message: error.response?.data?.message || "Internal Server Error",
        });
      } else {
        console.error("Unexpected error fetching secure data:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
