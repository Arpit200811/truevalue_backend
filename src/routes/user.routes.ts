import { Router } from "express";
import { register, login, getUsers, updateUser, deleteUser, updateProfile, updatePassword, testEmail } from "../controllers/user.controller";

const UserRouter = Router();

UserRouter.post("/register", register);
UserRouter.post("/login", login);
UserRouter.get("/", getUsers);
UserRouter.put("/:id", updateUser);
UserRouter.delete("/:id", deleteUser);
UserRouter.post("/update-profile", updateProfile);
UserRouter.post("/update-password", updatePassword);
UserRouter.post("/test-email", testEmail);

export default UserRouter;
