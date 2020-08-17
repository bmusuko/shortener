import { NextApiResponse, NextApiRequest } from "next";

export default (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case "POST":
      // Get data from your database
      res.status(200).json({
        hi: "hi1!",
      });
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
