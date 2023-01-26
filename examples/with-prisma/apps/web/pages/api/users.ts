import { client } from "database";
import { client as anotherClient } from "another-database";

import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Users
 *
 * @description A basic API endpoint to retrieve all the users in the database
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Only one of the clients below is generated, or both is generate but they overwrite eachother..
    const users = await client.user.findMany();
    const tomatoes = await anotherClient.tomato.findMany();
    if (!users || !tomatoes)
      throw {
        message: "Failed to retrieve users or tomatoes",
        status: 500,
      };

    return res.status(200).json({
      users,
    });
  } catch ({ message = "An unknown error occured", status = 500 }) {
    console.error({ message, status });
    return res.status(status).end(message);
  }
}
