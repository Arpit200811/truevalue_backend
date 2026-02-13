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

// ... imports logic is fine, just changing the DataSource config block

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true, // Always true for now to ensure tables are created on new DB
    logging: !isProduction,
    ssl: true, 
    extra: {
        ssl: {
            rejectUnauthorized: false
        }
    },
    entities: [
        User, Product, Category, Order, OrderItem, Notification,
        Ticket, TicketReply, Review, Offer, Banner, Rider,
        Setting, Brand, WalletTransaction, DeliveryZone, Coupon,
        Cart, CartItem
    ],
    subscribers: [],
    migrations: [],
});
