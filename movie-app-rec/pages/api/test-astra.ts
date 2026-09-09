import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/astra";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const collection = db.collection("mouvie_collection");

    const movie = await collection.findOne({});

    return res.status(200).json({
      success: true,
      movie,
    });
  } catch (error) {
    console.error("❌ ASTRA TEST ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}