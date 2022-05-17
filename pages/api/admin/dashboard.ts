import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { Order, Product, User } from "../../../models";

type Data =
  | {
      message: string;
    }
  | {
      numberOfOrders: number;
      paidOrders: number; // isPaid = true
      notPaidOrders: number; // isPaid = false
      numberOfClients: number; //role:Client
      numberOfProducts: number;
      productsWithNoInventory: number;
      lowInventory: number; //products with less than 10 products
    };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  await db.connect();

  const [numberOfOrders, paidOrders, numberOfClients, numberOfProducts, productsWithNoInventory, lowInventory] =
    await Promise.all([
      Order.count(),
      Order.find({ isPaid: true }).count(),
      User.find({ role: "client" }).count(),
      Product.count(),
      Product.find({ inStock: 0 }).count(),
      Product.find({ inStock: { $lte: 10 } }).count(),
    ]);

  await db.connect();

  res.status(200).json({
    numberOfOrders,
    paidOrders,
    notPaidOrders: numberOfOrders - paidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory,
  });
}
