import mongoose from "mongoose";


const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  reviewerName: {
    type: String,
    required: true
  },
  reviewerEmail: {
    type: String,
    required: true
  },
  reviewerPicture: {
    type: String,
    default: ''
  }
});

const imageSchema = new mongoose.Schema({
  big: {
    type: String,
    required: true
  },
  small: {
    type: String,
    required: true
  }
});

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  features: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  discountPercentage: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  tags: [{
    type: String,
    required: true
  }],
  brand: {
    type: String,
    required: true
  },
  reviews: [reviewSchema],
  returnPolicy: {
    type: String,
    required: true
  },
  images: [imageSchema],
  thumbnail: {
    type: String,
    required: true
  },
  smallImages: [{
    type: String,
    required: true
  }]
});

const Product = mongoose.model('Product', productSchema);

export default Product;