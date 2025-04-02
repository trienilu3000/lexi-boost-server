import { Router } from "express";
import { login, refreshToken, register, logout, getUserInfo } from "../controllers/auth.controller";
import passport from "../config/passport"

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);
router.get("/my-info", getUserInfo);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        res.json({ message: "Login successful", user: req.user });
    }
);

export default router;