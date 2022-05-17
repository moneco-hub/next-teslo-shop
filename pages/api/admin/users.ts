import type { NextApiRequest, NextApiResponse } from "next";
import { isValidObjectId } from "mongoose";

import { db } from "../../../database";
import { IUser } from "../../../interfaces";
import { User } from "../../../models";

type Data =
  | {
      message: string;
    }
  | IUser[];

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case "GET":
      return getUsers(req, res);
    case "PUT":
      return updateUser(req, res);

    default:
      return res.status(400).json({ message: "Bad Request" });
  }
}
const getUsers = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect();
  try {
    const users = await User.find().select("-password").lean();
    return res.status(200).json(users);
  } catch (error) {
    await db.disconnect();
    console.log(error);
    return res.status(500).json({ message: "Check the logs" });
  }
};

const updateUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { userId = "", role = "" } = req.body;

  if (!isValidObjectId(userId)) {
    return res.status(400).json({ message: "Id does not exist" });
  }

  const validRoles = ["admin", "super-user", "SEO", "client"];
  if (!validRoles.includes(role)) {
    return res.status(404).json({ message: "Not allowed rol:" + validRoles.join(", ") });
  }

  await db.connect();
  const user = await User.findById(userId);
  if (!user) {
    await db.disconnect();
    return res.status(404).json({ message: "User Not Found:" + userId });
  }

  user.role = role;
  await user.save({ validateBeforeSave: true });

  await db.disconnect();

  return res.status(200).json({ message: "User updated successfully" });
};
