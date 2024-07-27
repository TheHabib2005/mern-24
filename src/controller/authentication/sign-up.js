import { hashSync } from "bcrypt";
import User from "../../model/user.model.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
const signupController = async (req, res) => {
  const userInfo = await req.body;
  const { email, username, password } = userInfo;

  //basic validaction

  if ((!email, !username, !password)) {
    return res.status(400).json({
      success: false,
      message: "all feild are required",
    });
  }

  //check is user already in db
  try {
    const findUser = await User.findOne({ email });
    if (findUser) {
      return res.status(400).json({
        success: false,
        message: "this email is already used by another user",
      });
    }

    let verificationCode = 18975;

    if (!findUser) {
      const newUser = await User.create({
        username,
        email,
        password,
        profilePicture:
          "https://cdn-icons-png.flaticon.com/512/1053/1053244.png",
        isVeified: false,
        provider: "local",
        verificationCode: verificationCode,
      });
      let savedUser = await newUser.save();

      //send email notification

      // Create a transporter object using SMTP with Gmail
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "mdwear2005@gmail.com", // Your Gmail email address
          pass: "alzd eyhv wllv svnt", // Your Gmail password or app password
        },
      });

      // Email options
      let mailOptions = {
        from: "mdwear2005@gmail.com", // Sender address
        to: email, // List of recipients
        subject: "Hello from Node.js", // Subject line
        text: "This is a test email sent from Node.js using Nodemailer!", // Plain text body
        html: `verifaction code is ${verificationCode}`, // HTML body
      };

      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("maill error sending mail", error);
          return res.status(400).json({
            success: false,
            message: "Failed to send email! try Again later",
          });
        }
        console.log("Email sent: " + info.response);
      });

      return res.status(200).json({
        success: true,
        message: "Account created successfully",
        redricetUrl:`${process.env.FRONTEND_URL}/verify-email?user_v=${savedUser.__v}&user_id=${savedUser._id}`
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Failed to create account",
    });
  }
};

export default signupController;
