import User from "../../model/user.model.js";
import jwt from "jsonwebtoken";
import cookie from "cookie"
const googleLoginColtroller = async (req, res) => {
  let userInfo = await req.body;
  let { email, username, profilePicture,password } = userInfo;

  try {
    let findUser = await User.findOne({ email: email, provider: "google" });

    if (findUser) {
      const token = generateToken(findUser);

      const serializedCookie = cookie.serialize('auth-token', token, {
        httpOnly: false,
        secure: true, // Make sure your site is served over HTTPS
        sameSite: 'None',
        maxAge: 3600, // 1 hour
        path: '/',    // Ensure cookie is accessible across the site
      });
    
      res.setHeader('Set-Cookie', serializedCookie);
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

        const serializedCookie = cookie.serialize('auth-token', token, {
          httpOnly: false,
          secure: true, // Make sure your site is served over HTTPS
          sameSite: 'None',
          maxAge: 3600, // 1 hour
          path: '/',    // Ensure cookie is accessible across the site
        });
      
        res.setHeader('Set-Cookie', serializedCookie);
      
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
