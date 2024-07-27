import User from "../../model/user.model.js";
import jwt from "jsonwebtoken";

const googleLoginColtroller = async (req, res) => {
  let userInfo = await req.body;
  let { email, username, profilePicture,password } = userInfo;
  const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });
  };
  try {
    let findUser = await User.findOne({ email: email, provider: "google" });

    if (findUser) {
      const token = generateToken(findUser._id);

      res.cookie("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
      });
      return res.status(201).json({
        success: true,
        message: "User Signed in successfully",
      });
    } else {
      let findUser = await User.findOne({ email: email });
      if (findUser) {
        return res.status(400).json({
          success: false,
          message: "this email is already used by another user",
        });
      } else {
        const newUser = await User.create({
          username,
          email,
          password,
          profilePicture: profilePicture,
          isVerified: true,
          provider: "google",
          verificationCode: null,
        });
        let savedUser = await newUser.save();
        //send email notification

      
        const token = generateToken(savedUser._id);

        res.cookie("auth-token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
        });
      
        return res
          .status(200)
          .json({
            success: true,
            message: "User Signed in successfully",
            user_token: token,
          })
         
      }
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Failed to Signed",
    });
  }
};

export default googleLoginColtroller;
