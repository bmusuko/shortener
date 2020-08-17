import { NextApiResponse } from "next";

const responseGenerator = (
  response: NextApiResponse,
  status: number,
  message?: string,
  data?: any
) => {
  return response.status(status).json({
    status,
    message,
    data,
  });
};

export { responseGenerator };
