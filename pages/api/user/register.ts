import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";

import { db } from "../../../database";
import { User } from "../../../models";
import { jwt, validations } from "../../../utils";

type Data =
  | {
      message: string;
    }
  | {
      token: string;
      user: {
        email: string;
        role: string;
        name: string;
      };
    };

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case "POST":
      return registerUser(req, res);
    default:
      return res.status(400).json({ message: "Bad request" });
  }
}

const registerUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { name = "", email = "", password = "" } = req.body as { name: string; email: string; password: string };

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must contain at least 6 caracters" });
  }

  if (name.length < 2) {
    return res.status(400).json({ message: "The name must contain at least 2 caracters" });
  }

  if (!validations.isValidEmail(email)) {
    return res.status(400).json({ message: "The email must has a valid format" });
  }

  await db.connect();
  const user = await User.findOne({ email }).lean();

  if (user) {
    await db.disconnect();
    return res.status(400).json({ message: "This email is already registered" });
  }

  const newUser = new User({
    email: email.toLocaleLowerCase(),
    password: bcrypt.hashSync(password),
    role: "client",
    name,
  });

  try {
    await newUser.save({ validateBeforeSave: true });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ message: "Check server logs" });
  }
  await db.disconnect();

  const { _id, role } = newUser;
  const token = jwt.signToken(_id, email);

  return res.status(200).json({
    token,
    user: {
      email,
      role,
      name,
    },
  });
};
