import { Router } from "express";
import {
  startLesson,
  completeLesson,
  getCurrentProgress,
} from "../controllers/userprogress.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/start", authMiddleware, startLesson);
router.post("/complete", authMiddleware, completeLesson);
router.get("/current", authMiddleware, getCurrentProgress);

export default router;
