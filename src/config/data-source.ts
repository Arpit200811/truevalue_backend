import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Category } from "../entities/Category";
import { Product } from "../entities/Product";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { Notification } from "../entities/Notification";
import { Ticket } from "../entities/Ticket";
import { Setting } from "../entities/Setting";
import { Brand } from "../entities/Brand";
import { Review } from "../entities/Review";
import { Offer } from "../entities/Offer";
import { Banner } from "../entities/Banner";
import { TicketReply } from "../entities/TicketReply";
import { Rider } from "../entities/Rider";
import { WalletTransaction } from "../entities/WalletTransaction";
import { DeliveryZone } from "../entities/DeliveryZone";
import { Coupon } from "../entities/Coupon";
import { Cart, CartItem } from "../entities/Cart";
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: !isProduction,
    logging: !isProduction,
    entities: [
        User, Product, Category, Order, OrderItem, Notification,
        Ticket, TicketReply, Review, Offer, Banner, Rider,
        Setting, Brand, WalletTransaction, DeliveryZone, Coupon,
        Cart, CartItem
    ],
    subscribers: [],
    migrations: [],
});
