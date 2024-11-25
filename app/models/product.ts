import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  userId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ['clothing', 'shoes', 'accessories'],
    },
    stock: { type: Number, required: true },
    images: [{ type: String, required: true }],
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Create indexes for better query performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ userId: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

const ProductModel = models?.Product || model<IProduct>('Product', productSchema);

export default ProductModel;
