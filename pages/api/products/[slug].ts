import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { IProduct } from "../../../interfaces";
import { Product } from "../../../models";
import { SHOP_CONSTANTS } from "../../../database/constants";

type Data =
  | {
      message: string;
    }
  | IProduct;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { slug = "" } = req.query;
  if (slug === "") {
    return res.status(400).json({ message: "slug is required" });
  }

  switch (req.method) {
    case "GET":
      return getProductBySlug(req, res);

    default:
      return res.status(400).json({ message: "Bad request" });
  }
}

const getProductBySlug = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { slug = "" } = req.query;

  let condition = { slug };

  await db.connect();
  const product = await Product.findOne(condition)
    .select("title images price inStock slug -_id")

    .lean();
  await db.disconnect();

  if (!!!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  product.images = product.images.map((image) => {
    return image.includes("http") ? image : `${process.env.HOST_NAME}/products/${image}`;
  });

  return res.status(200).json(product!);
};
