import { Request, Response } from "express";
import admin from "../config/firebase";

export const verifyFirebaseOtp = async (req: Request, res: Response) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({ message: "ID Token required" });
        }

        const decodedToken = await admin.auth().verifyIdToken(idToken);

        const phoneNumber = decodedToken.phone_number;

        res.status(200).json({
            message: "OTP verified successfully",
            phoneNumber,
            uid: decodedToken.uid,
        });
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};
