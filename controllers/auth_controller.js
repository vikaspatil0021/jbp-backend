import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

import { Company_model } from "../models/model.js";

import mail_service from "../services/node_mailer/service.js";



export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Missing data field" });
        }

        const existingUser = await Company_model.findOne({ email: email });
        if (existingUser) {
            return res.status(200).json({ message: "Looks like you already have an account. Log in!" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const data = await Company_model.create({
            name,
            email,
            password: hashPassword
        })

        await data.save();

        const verification_token = jwt.sign(
            { id: data._id },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        const mail_ptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verify your email",
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #4CAF50;">Welcome, ${name}!</h2>
                    <p>Thank you for signing up. Please verify your email by clicking the link below:</p>
                    <a href="https://job-posting-board-liart.vercel.app/verify_email?token=${verification_token}" 
                       style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #4CAF50; text-decoration: none; border-radius: 5px; margin-top: 10px;">
                       Verify Email
                    </a>
                    <p style="font-size: 12px; color: #999;">This is an automated email. Please do not reply to this message.</p>
                </div>
            `,
        };


        await mail_service.sendMail(mail_ptions);

        res.status(201).json({ message: "Company registered! Check your email to verify your account." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
}


export const verify_email = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(404).json("token not found");

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const data = await Company_model.findById(decoded.id);
        if (!data) {
            return res.status(404).json({ message: "Company not found" });
        }

        if (data.isVerified) {
            return res.status(400).json({ message: "Email already verified" });
        }

        data.isVerified = true;
        await data.save();

        res.status(200).json({ message: "Email verified successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Missing field" });
        }

        const data = await Company_model.findOne({ email });
        if (!data) {
            return res.status(404).json({ message: "Company not found" });
        }

        if (!data.isVerified) {
            return res.status(403).json({ message: "Please verify your email first" });
        }

        const isMatch = await bcrypt.compare(password, data.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Wrong password" });
        }

        let new_token = jwt.sign({ id: data._id }, process.env.JWT_SECRET, { expiresIn: "24h" });

        res.cookie("token", new_token, { httpOnly: true, secure: process.env.NODE_ENV == 'production', sameSite: 'None' });

        res.status(200).json({ message: "Login successful" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const logout = (req, res) => {
    try {
        res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV == 'production', sameSite: 'None' });
        res.status(200).json({ message: "Logged out successful" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};


export const verify_session = (req, res) => {
    const token = req.cookies.token;
    console.log(token)
    if (!token) {
        return res.status(401).json({ success: false, message: "Token missing" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.json({ success: true, user: decoded });
    } catch (error) {
        console.log(error)
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};