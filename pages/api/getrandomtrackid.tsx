import { getRandomItemId } from "lib/fetchFromArchive";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const id = await getRandomItemId();

  res.statusCode = 200;
  res.json({ randomId: id });
};
