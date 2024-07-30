import User from "../../model/user.model.js";
import jwt from "jsonwebtoken";

const googleLoginColtroller = async (req, res) => {
  let userInfo = await req.body;
  let { email, username, profilePicture,password } = userInfo;
  const generateToken = (userData) => {
    return jwt.sign({ userData }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });
  };
  try {
    let findUser = await User.findOne({ email: email, provider: "google" });

    if (findUser) {
      const token = generateToken(findUser);

      res.cookie("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 10 * 60 * 1000,
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

      
        const token = generateToken(savedUser);

        res.cookie("auth-token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 10 * 60 * 1000,
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
