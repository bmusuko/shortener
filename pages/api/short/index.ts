import { NextApiResponse, NextApiRequest } from "next";
import { dbConnect } from "../../../utils/dbConnect";
import Joi from "@hapi/joi";
import { responseGenerator } from "../../../utils/responseGenerator";
import { Shortener } from "../../../models/Shortener";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, query } = req;
  switch (method) {
    case "GET": // get real link
      await dbConnect();
      const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true, // remove unknown props
      };

      const schema = Joi.object({
        link: Joi.string().alphanum().required(),
      });

      const { error } = schema.validate(query, options);
      if (error) {
        return responseGenerator(res, 400, error.message);
      }

      const link = query.link;
      if (!link) {
        return responseGenerator(res, 400, "need link");
      }

      const realLink = await Shortener.findOne(
        { generated_link: link },
        { _id: 0, __v: 0, updated_at: 0, generated_link: 0, password: 0 }
      ).exec();
      if (!realLink) {
        return responseGenerator(res, 404, "link not found");
      }
      return responseGenerator(res, 200, "get link", realLink);
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
