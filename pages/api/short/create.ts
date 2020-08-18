import { NextApiResponse, NextApiRequest } from "next";
import { dbConnect } from "../../../utils/dbConnect";
import Joi from "@hapi/joi";
import { responseGenerator } from "../../../utils/responseGenerator";
import { Shortener } from "../../../models/Shortener";
import { isLinkAvailable } from "../../../utils/isLinkAvailable";
import randomstring from "randomstring";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case "POST": // get real link
      await dbConnect();
      const schema = Joi.object({
        real_link: Joi.string().uri(),
        desired_link: Joi.string().regex(/^([a-zA-Z0-9_-]+)$/), // alphanumeric + dash + underline
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
      let random_link_length = 5;
      if (!desired_link) {
        while (true) {
          desired_link = randomstring.generate({
            length: random_link_length,
            charset: "alphanumeric",
          });
          if (await isLinkAvailable(desired_link)) {
            break;
          }
        }
      } else {
        if (!(await isLinkAvailable(desired_link))) {
          return responseGenerator(res, 409, "link already taken");
        }
      }
      try {
        const shortener_model = new Shortener({
          generated_link: desired_link,
          real_link: real_link,
        });
        const saved_model = await shortener_model.save();
        return responseGenerator(res, 200, "link is saved", saved_model);
      } catch {
        return responseGenerator(res, 500, "unexpected error");
      }
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
