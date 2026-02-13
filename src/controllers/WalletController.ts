import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { WalletTransaction } from "../entities/WalletTransaction";

export class WalletController {
    private get userRepo() { return AppDataSource.getRepository(User); }
    private get trxRepo() { return AppDataSource.getRepository(WalletTransaction); }

    async addFunds(req: Request, res: Response) {
        try {
            const { userId, amount, reason } = req.body;
            const user = await this.userRepo.findOneBy({ id: userId });
            if (!user) return res.status(404).json({ message: "User not found" });

            user.wallet_balance = Number(user.wallet_balance) + Number(amount);
            await this.userRepo.save(user);

            const trx = new WalletTransaction();
            trx.user = user;
            trx.amount = amount;
            trx.type = "CREDIT";
            trx.reason = reason || "Admin added funds";
            await this.trxRepo.save(trx);

            return res.json({ message: "Funds added", balance: user.wallet_balance });
        } catch (error) {
            return res.status(500).json({ message: "Error adding funds", error });
        }
    }

    async deductFunds(req: Request, res: Response) {
        try {
            const { userId, amount, reason } = req.body;
            const user = await this.userRepo.findOneBy({ id: userId });
            if (!user) return res.status(404).json({ message: "User not found" });

            if (user.wallet_balance < amount) {
                return res.status(400).json({ message: "Insufficient balance" });
            }

            user.wallet_balance = Number(user.wallet_balance) - Number(amount);
            await this.userRepo.save(user);

            const trx = new WalletTransaction();
            trx.user = user;
            trx.amount = amount;
            trx.type = "DEBIT";
            trx.reason = reason || "Admin deducted funds";
            await this.trxRepo.save(trx);

            return res.json({ message: "Funds deducted", balance: user.wallet_balance });
        } catch (error) {
            return res.status(500).json({ message: "Error deducting funds", error });
        }
    }

    async getHistory(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const history = await this.trxRepo.find({
                where: { user: { id: Number(userId) } },
                order: { createdAt: "DESC" }
            });
            return res.json(history);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching history", error });
        }
    }
}
