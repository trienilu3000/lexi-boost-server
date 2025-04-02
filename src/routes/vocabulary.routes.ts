import { Router } from "express";
import { addWord, deleteWord, getAllWords, updateWord } from "../controllers/vocab.controller";


const router = Router();

router.get("/vocabulary", getAllWords);
router.post("/vocabulary", addWord);
router.put("/vocabulary/:id", updateWord);
router.delete("/vocabulary/:id", deleteWord);

export default router;