import mongoose, { Schema, model, Model } from "mongoose";
import { IProduct } from "../interfaces";

const ProductSchema = new Schema(
  {
    description: { type: String, required: true, default: "" },
    images: [{ type: String }],
    inStock: { type: Number, required: true, default: 0 },
    price: { type: Number, default: 0 },
    sizes: [{ type: String, enum: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"], message: "{VALUE} is not a valid value" }],
    slug: { type: String, required: true, unique: true },
    tags: [{ type: String, required: true }],
    title: { type: String, required: true, default: "" },
    type: {
      type: String,
      enum: ["shirts", "pants", "hoodies", "hats"],
      message: "{VALUE} is not a valid value",
      default: "shirts",
    },
    gender: { type: String, enum: ["men", "women", "kid", "unisex"], message: "{VALUE} is not a valid value", default: "woman" },
  },
  {
    timestamps: true,
  }
);

ProductSchema.index({ title: "text", tags: "text" });

const Product: Model<IProduct> = mongoose.models.Product || model("Product", ProductSchema);

export default Product;
