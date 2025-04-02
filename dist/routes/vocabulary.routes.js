"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vocab_controller_1 = require("../controllers/vocab.controller");
const router = express_1.default.Router();
router.get("/", vocab_controller_1.getWords);
router.post("/", vocab_controller_1.addWord);
router.put("/:id", vocab_controller_1.updateWord);
router.delete("/:id", vocab_controller_1.deleteWord);
exports.default = router;
