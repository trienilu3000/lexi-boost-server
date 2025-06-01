import { Router } from "express";
import { getAllLearning } from "../controllers/learning.controller";

const router = Router();

router.get("/", getAllLearning);

export default router;
