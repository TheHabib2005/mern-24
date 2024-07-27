
import User from "../../model/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
const signInController = async (req, res) => {
  const userInfo = await req.body;
  const { email, password } = userInfo;

  //basic validaction

  if ((!email, !password)) {
    return res.status(400).json({
      success: false,
      message: "all feild are required",
    });
  }

  try {
    const findUser = await User.findOne({ email });
    if (!findUser) {
      return res.status(400).json({
        success: false,
        message: "account not found",
      });
    }

    const isMatch = await bcrypt.compare(password, findUser.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "wrong password",
      });
    }

    // Generate JWT Token
    const generateToken = (id) => {
      return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "2d",
      });
    };

    const token = generateToken(findUser._id);

    res.cookie("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
    });
   

    if (findUser) {
      return res.status(200).json({
        success: true,
        message: "user Login Successfully",
      })
    }
  }catch(error){
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Failed to login Account ",
    });
  }
};

export default signInController;
