import { NextApiResponse, NextApiRequest } from "next";
import { dbConnect } from "../../../utils/dbConnect";
import Joi from "@hapi/joi";
import { responseGenerator } from "../../../utils/responseGenerator";
import { Shortener } from "../../../models/Shortener";
import { isLinkAvailable } from "../../../utils/isLinkAvailable";
import randomWords from "random-words";
import bcrypt from "bcryptjs";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case "POST": // get real link
      await dbConnect();
      const schema = Joi.object({
        real_link: Joi.string().uri().required(),
        desired_link: Joi.string().regex(/^([a-zA-Z0-9_-]+)$/), // alphanumeric + dash + underline
        password: Joi.string(),
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
      const real_link: string = req.body.real_link;
      let desired_link: string | undefined = req.body.desired_link;
      if (!desired_link) {
        while (true) {
          desired_link = randomWords({ exactly: 2, join: "-" });
          if (await isLinkAvailable(desired_link)) {
            break;
          }
        }
      } else {
        if (!(await isLinkAvailable(desired_link))) {
          return responseGenerator(res, 409, "link is already taken");
        }
      }
      try {
        let body = {
          generated_link: desired_link,
          real_link: real_link,
        };
        if (req.body.password) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(req.body.password, salt);
          body["is_password"] = true;
          body["password"] = hashedPassword;
        }
        const shortener_model = new Shortener(body);
        const saved_model = await shortener_model.save();
        return responseGenerator(res, 200, "link is saved", {
          generated_link: saved_model["generated_link"],
          is_password: saved_model["is_password"],
        });
      } catch {
        return responseGenerator(res, 500, "unexpected error");
      }
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
