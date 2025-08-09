import sendEmail from "../config/sendEmail.js";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import upload from "../utils/upload.js";
import generateOtp from "../utils/generateOtp.js";
import jwt from "jsonwebtoken"
export async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Provide email, name and password.",
        error: true,
        success: false,
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "Email already exists.",
        error: true,
        success: false,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const payload = {
      name,
      email,
      password: hashedPassword,
    };
    const newUser = new User(payload);
    const save = await newUser.save();

    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save._id}`;

    const verifyEmail = await sendEmail({
      sendTo: email,
      subject: "Verify your email",
      html: verifyEmailTemplate({
        name,
        url: verifyEmailUrl,
      }),
    });

    return res.status(200).json({
      message: "User registered successfully.",
      error: false,
      success: true,
      data: save,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function verifyEmail(req, res) {
  try {
    const { code } = req.body;
    const user = await User.findOne({ _id: code });
    if (!user) {
      return res.status(400).json({
        message: "Invalid user id.",
        error: true,
        success: false,
      });
    }
    const updateUser = await User.updateOne(
      { _id: code },
      {
        verify_email: true,
      }
    );
    return res.status(201).json({
      message: "User verified.",
      error: false,
      success: true,
      data: save,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Provide email or password.",
        error: true,
        success: false,
      });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User does not exists.",
        error: true,
        success: false,
      });
    }
    if (user.status !== "Active") {
      return res.status(400).json({
        message: "User account status is not active. Contact admin.",
        error: true,
        success: false,
      });
    }
    const checkPassword = await bcryptjs.compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).json({
        message: "Wrong password credential.",
        error: true,
        success: false,
      });
    }
    const accessToken = await generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);
    return res.status(200).json({
      message: "User logged in successfully.",
      error: false,
      success: true,
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken,
        user,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function logout(req, res) {
  try {
    const userId = req.userId;
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    const removeRefreshToken = await User.findByIdAndUpdate(userId, {
      refresh_token: "",
    });
    return res.status(200).json({
      message: "User logged out successfully.",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function uploadAvatar(req, res) {
  try {
    const userId = req.userId;
    const image = req.file;
    const uploadImage = await upload(image);
    const updateUser = await User.findByIdAndUpdate(userId, {
      avatar: uploadImage.secure_url,
    });
    return res.status(200).json({
      message: "Profile upload successful.",
      error: false,
      success: true,
      data: {
        id: updateUser._id,
        avatar: uploadImage.secure_url,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function updateUser(req, res) {
  try {
    const userId = req.userId;
    const { name, email, mobile, password } = req.body;
    let hashPassword = "";
    if (password) {
      const salt = await bcryptjs.genSalt(10);
      hashPassword = await bcryptjs.hash(password, salt);
    }

    const updateUser = await User.updateOne(
      { _id: userId },
      {
        ...(name && { name: name }),
        ...(email && { email: email }),
        ...(mobile && { mobile: mobile }),
        ...(password && { password: hashPassword }),
      }
    );

    const updatedUser = await User.findById(userId);
    return res.status(200).json({
      message: "Profile updated successfully",
      error: false,
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    const otp = generateOtp();
    const expireTime = new Date(Date.now() + 60 * 10 * 1000); // 10 mins later

    const update = await User.findByIdAndUpdate(user._id, {
      forgot_password_otp: otp,
      forgot_password_expiry: expireTime,
    });

    await sendEmail({
      sendTo: email,
      subject: "Forgot Password OTP",
      html: forgotPasswordTemplate({ name: user.name, otp }),
    });

    return res.status(201).json({
      message: "Otp sent successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function verifyForgotPasswordOtp(req, res) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        message: "Provide email and opt.",
        error: true,
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }
    const currTime = new Date();

    if (user.forgot_password_expiry <= currTime) {
      return res.status(400).json({
        message: "OTP expired.",
        error: true,
        success: false,
      });
    }
    if (user.forgot_password_otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP.",
        error: true,
        success: false,
      });
    }

    await User.findByIdAndUpdate(user._id, {
      forgot_password_verified: true,
    });

    return res.status(201).json({
      message: "OTP verified.",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function resetPassword(req, res) {
  try {
    const { email, newPassword, confirmPassword } = req.body;
    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "Provide required fields.",
        error: true,
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Password does not match.",
        error: true,
        success: false,
      });
    }
    if (!user.forgot_password_verified) {
      return res.status(403).json({
        message: "OTP not verified",
        error: true,
        success: false,
      });
    }
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);
    const update = await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      forgot_password_verified: false,
      forgot_password_otp: null,
      forgot_password_expiry: null,
    });
    return res.status(201).json({
      message: "Password updated successfully.",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function refreshToken(req, res) {
  try {
    const refreshToken =
      req.cookies.refreshToken || req?.header?.authorization?.split(" ")[1];
    if (!refreshToken) {
      return res.status(401).json({
        message: "Invalid token.",
        error: true,
        success: false,
      });
    }

    const verifyToken = await jwt.verify(
      refreshToken,
      process.env.SECRET_KEY_REFRESH_TOKEN
    );
    if (!verifyToken) {
      return res.status(401).json({
        message: "Token expired.",
        error: true,
        success: false,
      });
    }
    const userId = verifyToken._id
    const newAccessToken = await generateAccessToken(userId) 
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    res.cookie('accessToken', newAccessToken, cookieOptions )
    return res.status(201).json({
      message:   "New access token generated.",
      error: false,
      success: true,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
