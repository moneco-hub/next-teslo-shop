import type { NextApiRequest, NextApiResponse } from "next";
import { isValidObjectId } from "mongoose";
import { v2 as cloudinary } from "cloudinary";

import { db } from "../../../database";
import { IProduct } from "../../../interfaces";
import { Product } from "../../../models";

type Data =
  | {
      message: string;
    }
  | IProduct
  | IProduct[];

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case "GET":
      return getProducts(req, res);
    case "PUT":
      return updateProduct(req, res);
    case "POST":
      return createProduct(req, res);
    default:
      res.status(400).json({ message: "Bad Request" });
  }
}
const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect();

  const products = await Product.find().sort({ title: "asc" }).lean();

  await db.disconnect();

  const updatedProducts = products.map((product) => {
    product.images = product.images.map((image) => {
      return image.includes("http") ? image : `${process.env.HOST_NAME}/products/${image}`;
    });
    return product;
  });

  return res.status(200).json(updatedProducts);
};

const updateProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { _id = "", images = [] } = req.body as IProduct;

  if (!isValidObjectId(_id)) {
    return res.status(400).json({ message: "The id is not valid" });
  }

  if (images.length < 2) {
    return res.status(400).json({ message: "Provide at least 2 images" });
  }

  try {
    await db.connect();
    const product = await Product.findById(_id);
    if (!product) {
      await db.disconnect;
      return res.status(400).json({ message: "Does not exist a product for the provided id:" + _id });
    }
    //TODO: Delete photos from cloudinary
    product.images.forEach(async (image) => {
      if (!images.includes(image)) {
        //Delete from cloudinary
        const [fileId, extension] = image.substring(image.lastIndexOf("/") + 1).split(".");
        console.log({ image, fileId, extension });
        await cloudinary.uploader.destroy(fileId);
      }
    });

    await product.update(req.body);
    await db.disconnect;

    return res.status(200).json(product);
  } catch (error) {
    await db.disconnect;
    console.log(error);
    return res.status(400).json({ message: "Check server console logs" });
  }
};

const createProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { images = [], slug } = req.body as IProduct;

  if (images.length < 2) {
    return res.status(400).json({ message: "Provide at least two images" });
  }

  try {
    await db.connect();
    const productInDB = await Product.findOne({ slug });
    if (productInDB) {
      return res.status(400).json({ message: "The are already a product with the provided slug" });
    }

    const product = new Product(req.body);
    await product.save({ validateBeforeSave: true });
    await db.disconnect();

    return res.status(201).json(product);
  } catch (error) {
    await db.disconnect();
    return res.status(400).json({ message: "Check server console logs" });
  }
};
