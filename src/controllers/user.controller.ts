import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { EmailService } from "../services/EmailService";

const getRepo = () => AppDataSource.getRepository(User);
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export const register = async (req: Request, res: Response) => {
    try {
        const userRepo = getRepo();
        const { name, email, password, phone, status } = req.body;


        const existing = await userRepo.findOneBy({ email });
        if (existing) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = userRepo.create({
            name,
            email,
            password: hashedPassword,
            phone,
            status: status || 'Active'
        });

        await userRepo.save(user);

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
        return res.status(201).json({ user, token });
    } catch (error) {
        return res.status(500).json({ message: "Error registering user", error });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const userRepo = getRepo();
        const { email, password } = req.body;
        console.log(email, password);
        const user = await userRepo.findOne({
            where: { email },
            select: ["id", "name", "email", "password"]
        });

        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        return res.json({ user: userWithoutPassword, token });
    } catch (error) {
        return res.status(500).json({ message: "Error logging in", error });
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const userRepo = getRepo();
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;
        const search = req.query.search as string;

        const queryBuilder = userRepo.createQueryBuilder("user")
            .orderBy("user.id", "DESC")
            .skip((page - 1) * limit)
            .take(limit);

        if (search) {
            queryBuilder.andWhere("user.name ILIKE :search OR user.email ILIKE :search", { search: `%${search}%` });
        }

        const [users, total] = await queryBuilder.getManyAndCount();

        return res.json({
            data: users,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching users", error });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const userRepo = getRepo();
        const { id } = req.params;
        let user = await userRepo.findOneBy({ id: parseInt(id as string) });
        if (!user) return res.status(404).json({ message: "User not found" });

        Object.assign(user, req.body);
        await userRepo.save(user);
        return res.json(user);
    } catch (error) {
        return res.status(500).json({ message: "Error updating user", error });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const userRepo = getRepo();
        const { id } = req.params;
        const result = await userRepo.delete(id);
        if (result.affected === 0) return res.status(404).json({ message: "User not found" });
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: "Error deleting user", error });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userRepo = getRepo();
        const { id, name, avatar, phone } = req.body;
        let user = await userRepo.findOneBy({ id: parseInt(id as string) });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (name) user.name = name;
        if (avatar) user.avatar = avatar;
        if (phone) user.phone = phone;

        await userRepo.save(user);
        return res.json(user);
    } catch (error: any) {
        return res.status(500).json({ message: "Error updating profile", error: error.message });
    }
};

export const updatePassword = async (req: Request, res: Response) => {
    try {
        const userRepo = getRepo();
        const { id, currentPassword, newPassword } = req.body;
        let user = await userRepo.findOne({
            where: { id: parseInt(id as string) },
            select: ["id", "password"]
        });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(401).json({ message: "Current password incorrect" });

        user.password = await bcrypt.hash(newPassword, 10);
        await userRepo.save(user);

        return res.json({ message: "Password updated successfully" });
    } catch (error: any) {
        return res.status(500).json({ message: "Error updating password", error: error.message });
    }
};

export const testEmail = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const success = await EmailService.sendEmail(
            email,
            "TrueValue Test Connection",
            "Congratulations! Your SMTP settings are correctly configured for the Super-App Admin Panel."
        );
        if (success) return res.json({ message: "Test email sent!" });
        return res.status(500).json({ message: "SMTP configuration failed" });
    } catch (error: any) {
        return res.status(500).json({ message: "Error testing email", error: error.message });
    }
};

