import { NextApiResponse, NextApiRequest } from "next";
import { dbConnect } from "../../../utils/dbConnect";
import { responseGenerator } from "../../../utils/responseGenerator";
import { Shortener } from "../../../models/Shortener";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case "GET":
      await dbConnect();

      try {
        const all_link = await Shortener.find(
          {},
          {
            _id: 0,
            __v: 0,
            updated_at: 0,
            real_link: 0,
            is_password: 0,
            password: 0,
          }
        );
        return responseGenerator(res, 200, "success", all_link);
      } catch {
        return responseGenerator(res, 500, "unexpected error");
      }
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
