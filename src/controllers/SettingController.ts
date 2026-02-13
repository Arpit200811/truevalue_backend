import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Setting } from "../entities/Setting";

export class SettingController {
    private get settingRepository() { return AppDataSource.getRepository(Setting); }

    async getSettings(req: Request, res: Response) {
        try {
            let settings = await this.settingRepository.findOne({ where: {} });
            if (!settings) {
                // Return defaults if none found
                return res.json({
                    storeName: "Cloude Super-App",
                    supportEmail: "support@cloude.in",
                    address: "Sector 62, Noida, UP",
                    currency: "₹",
                    maintenance: false,
                    cod: true,
                    wallet: true
                });
            }
            return res.json(settings);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching settings", error });
        }
    }

    async updateSettings(req: Request, res: Response) {
        try {
            let settings = await this.settingRepository.findOne({ where: {} });
            if (!settings) {
                settings = this.settingRepository.create(req.body as object);
            } else {
                this.settingRepository.merge(settings, req.body as object);
            }
            await this.settingRepository.save(settings);
            return res.json(settings);
        } catch (error) {
            return res.status(500).json({ message: "Error updating settings", error });
        }
    }
}
