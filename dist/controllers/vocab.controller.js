"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWord = exports.updateWord = exports.addWord = exports.getWords = void 0;
const ormconfig_1 = require("../config/ormconfig");
const Vocabulary_1 = require("../entities/Vocabulary");
const vocabRepo = ormconfig_1.AppDataSource.getRepository(Vocabulary_1.Vocabulary);


const getWords = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const words = yield vocabRepo.find();
        return res.json(words); // ✅ Trả về Response thay vì trả Promise<Response>
    }
    catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getWords = getWords;

const addWord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newWord = vocabRepo.create(req.body);
        yield vocabRepo.save(newWord);
        return res.status(201).json(newWord);
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to add word" });
    }
});
exports.addWord = addWord;


const updateWord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield vocabRepo.update(id, req.body);
        return res.json({ message: "Updated successfully" });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to update word" });
    }
});
exports.updateWord = updateWord;


const deleteWord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield vocabRepo.delete(id);
        return res.json({ message: "Deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to delete word" });
    }
});
exports.deleteWord = deleteWord;
