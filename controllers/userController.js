const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
// const crypto = require('crypto');
require('dotenv').config();  // Ensure environment variables are loaded

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendMail = (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log('Error sending email:', err);
            return;
        }
        console.log('Email sent:', info.response);
    });
};

exports.register = async (req, res) => {
    try {
        const { firstname, lastname, email, mobile } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists',errorCode: "203", });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const otpExpires = Date.now() + 120000; // 2 minutes

        user = new User({
            firstname,
            lastname,
            email,
            mobile,
            otp,
            otpExpires
        });

        await user.save();  // Save the user before sending the email

        // Send OTP email
        sendMail(email, 'OTP Verification', `Your OTP code is ${otp}`);

        res.status(200).json({ msg: 'OTP sent to email', errorCode: "200" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ msg: 'Passwords do not match',errorCode: "203" });
        }

        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'User not found',errorCode: "203" });
        }

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ msg: 'OTP is invalid or has expired',errorCode: "203" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        user.otp = undefined;
        user.otpExpires = undefined;

        await user.save();

        res.status(200).json({ msg: 'Password set successfully',errorCode: "200" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials',errorCode: "203" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials',errorCode: "203" });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 3600 },
            (err) => {
                if (err) throw err;
                res.json({ msg :"Login Successfull",firstname:`${user.firstname}`,lastname:`${user.lastname}`,email:`${user.email}`});
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};



exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'User not found',errorCode: "203" });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const otpExpires = Date.now() + 120000; // 2 minutes

        user.otp = otp;
        user.otpExpires = otpExpires;

        await user.save();  // Save the user before sending the email

        // Send OTP email
        sendMail(email, 'Password Reset OTP', 'Your OTP code is ${otp}');

        res.status(200).json({ msg: 'OTP sent to email',errorCode: "200" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getOtp = async (req, res) => {
    try {
        const { email } = req.body;

        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'User not found',errorCode: "203" });
        }

        res.status(200).json({
            otp: user.otp,
            otpExpires: user.otpExpires
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;


        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'User not found',errorCode: "203" });
        }


        // Hash the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        user.otp = undefined;
        user.otpExpires = undefined;

        await user.save();

        res.status(200).json({ msg: 'Password reset successfully',errorCode: "200" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
