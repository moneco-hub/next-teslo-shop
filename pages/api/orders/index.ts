import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { db } from "../../../database";

import { IOrder } from "../../../interfaces";
import { Order, Product } from "../../../models";

type Data =
  | {
      message: string;
    }
  | IOrder;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case "POST":
      return createOrder(req, res);

    default:
      return res.status(400).json({ message: "Bad Request" });
  }
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { orderItems, total } = req.body as IOrder;

  //Verify user
  const session: any = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: "You must to be authenticated to performance this action" });
  }

  // Create an array with the products the customer desire
  const productsIds = orderItems.map((product) => product._id);
  await db.connect();
  const dbProducts = await Product.find({ _id: { $in: productsIds } });

  try {
    const subTotal = orderItems.reduce((prev: number, current: any) => {
      const currentPrice = dbProducts.find((prod: any) => prod.id === current._id)!.price;
      if (!currentPrice) {
        throw new Error("Verify chart again. Product does not exist");
      }
      return current.quantity * currentPrice + prev;
    }, 0);

    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
    const backendTotal = subTotal * (1 + taxRate);

    if (total !== backendTotal) {
      throw new Error("The total does not match with the backend total");
    }

    //Everything is righ at this point
    const userId = session.user._id;
    const newOrder = new Order({
      ...req.body,
      isPaid: false,
      user: userId,
    });

    newOrder.total = Math.round(newOrder.total * 100) / 100;

    await newOrder.save({ validateBeforeSave: true });
    await db.disconnect();

    return res.status(201).json(newOrder);
  } catch (error) {
    await db.disconnect();
    console.log(error);
    return res.status(400).json({ message: "Check server logs" });
  }
};
