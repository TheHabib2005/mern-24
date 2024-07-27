import User from "../../model/user.model.js";

export const GetVerificationCode = async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res
      .status(400)
      .json({ success: false, message: "User ID is required" });
  }
  // check if user exists

  try {
    const user = await User.findById({ _id: user_id });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    return res
      .status(200)
      .json({ success: true, verificationCode: user.verificationCode });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        success: false,
        message: "something was wrong! please try again",
      });
  }
};

export const CheckIsValidCode = async (req, res) => {
  const { verificationCode } = req.body;

  if (!verificationCode) {
    return res
      .status(400)
      .json({ success: false, message: "verificationCode is required" });
  }
  // check if user exists
console.log(verificationCode);
   try {
    // Find the user by verification code
    const user = await User.findOne({ verificationCode });

  

    if (!user) {
      return res.status(404).json({ success: false, message: 'Verification code is invalid or user does not exist.' });
    }



 
    // Update the isVerified status
    user.isVerified = true;
    user.verificationCode = undefined; // Optionally, clear the verification code
    await user.save();

    return res.status(200).json({ success: true, message: 'User has been successfully verified.' });
  } catch (error) {
    console.error('Error verifying user:', error);
    return  res.status(500).json({ success: false, message: 'An error occurred during verification.' })
  }
};
