import nodemailer from "nodemailer";
export const emailTransport = nodemailer.createTransport({
  // host: "smtp.gmail.com",
  // secure: true,
  // auth: {
  //   user: "mdwear2005@gmail.com",
  //   pass: process.env.NEXT_PUBLIC_GOOGLE_SECRET_KEY,
  // },
  service: "gmail",
  auth: {
    user: "mdwear2005@gmail.com",
    pass: "ysdmetyqjkvxkkii",
  },
});

export default emailTransport;
