import { Shortener } from "../models/Shortener";

const isLinkAvailable = async (link: string): Promise<boolean> => {
  const temp_link = await Shortener.findOne({
    generated_link: link,
  }).exec();
  return !Boolean(temp_link);
};
export { isLinkAvailable };
