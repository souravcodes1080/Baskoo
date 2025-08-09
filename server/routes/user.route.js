import {Router} from 'express'
import {forgotPassword, login, logout, refreshToken, registerUser, resetPassword, updateUser, uploadAvatar, verifyEmail, verifyForgotPasswordOtp} from '../controllers/user.controller.js'
import auth from '../middleware/auth.js'
import upload from '../middleware/multer.js'
const userRouter = Router()

userRouter.post('/register',  registerUser)
userRouter.post('/verify',  verifyEmail)
userRouter.post('/login',  login)
userRouter.get('/logout', auth, logout)
userRouter.put('/upload-avatar', auth, upload.single('avatar'), uploadAvatar)
userRouter.put('/update-user', auth, updateUser)
userRouter.put('/forgot-password', forgotPassword)
userRouter.put('/verify-forgot-password-otp', verifyForgotPasswordOtp)
userRouter.put('/reset-password', resetPassword)
userRouter.post('/refresh-token', refreshToken)


export default userRouter