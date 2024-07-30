import mongoose from "mongoose";
import bcrypt from "bcrypt";

const cartItemSchema = new mongoose.Schema({
  productId: {
    type:String,
    required: true,
  },
  quantity: { type: Number, required: true, default: 1 },
});
const wishlistItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});



const userModel = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    required: true,
    enum: ["local", "google"],
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  verificationCode: {
    type: Number,
  },
  profilePicture: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/1053/1053244.png",
  },
  cart: [cartItemSchema],

  wishlist: [wishlistItemSchema],
});

userModel.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10); // Correct way to generate salt
    this.password = await bcrypt.hash(this.password, salt); // Correct way to hash password
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("user", userModel);

export default User;
