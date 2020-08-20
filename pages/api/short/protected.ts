import { NextApiResponse, NextApiRequest } from "next";
import { dbConnect } from "../../../utils/dbConnect";
import Joi from "@hapi/joi";
import { responseGenerator } from "../../../utils/responseGenerator";
import { Shortener } from "../../../models/Shortener";
import bcrypt from "bcryptjs";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case "POST": // get real link
      await dbConnect();
      const schema = Joi.object({
        desired_link: Joi.string()
          .regex(/^([a-zA-Z0-9_-]+)$/)
          .required(), // alphanumeric + dash + underline
        password: Joi.string().required(),
      });
      const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true, // remove unknown props
      };
      const { error } = schema.validate(req.body, options);
      if (error) {
        return responseGenerator(res, 400, error.message);
      }
      const model = await Shortener.findOne(
        {
          generated_link: req.body.desired_link,
        },
        {
          _id: false,
          __v: false,
          updated_at: false,
          is_password: false,
        }
      );
      if (!model) {
        return responseGenerator(res, 400, "link not found");
      }
      const checkPassword = await bcrypt.compare(
        req.body.password,
        model.password
      );
      if (!checkPassword) {
        return responseGenerator(res, 400, "wrong password");
      }
      model.password = undefined;
      return responseGenerator(res, 200, "success get link", model);

    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
