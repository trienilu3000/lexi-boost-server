import { Request, Response, NextFunction } from "express";
import { AppDataSource } from '../config/ormconfig';
import { ErrorHandler } from '../utils/errorHandler';

export const getAllWords = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AppDataSource.query("SELECT * FROM vocabulary");
    res.json(result.rows);
  } catch (error) {
    next(new ErrorHandler(500, "Failed to fetch vocabulary"));
  }
};

export const addWord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { word, meaning } = req.body;
    if (!word || !meaning) return next(new ErrorHandler(400, "Word and meaning are required"));

    const result = await AppDataSource.query(
      "INSERT INTO vocabulary (word, meaning) VALUES ($1, $2) RETURNING *",
      [word, meaning]
    );
    res.json(result.rows[0]);
  } catch (error) {
    next(new ErrorHandler(500, "Failed to add word"));
  }
};

export const updateWord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { word, meaning } = req.body;
    const result = await AppDataSource.query(
      "UPDATE vocabulary SET word = $1, meaning = $2 WHERE id = $3 RETURNING *",
      [word, meaning, id]
    );

    if (result.rowCount === 0) return next(new ErrorHandler(404, "Word not found"));
    res.json(result.rows[0]);
  } catch (error) {
    next(new ErrorHandler(500, "Failed to update word"));
  }
};

export const deleteWord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await AppDataSource.query("DELETE FROM vocabulary WHERE id = $1 RETURNING *", [id]);

    if (result.rowCount === 0) return next(new ErrorHandler(404, "Word not found"));
    res.json({ message: "Word deleted" });
  } catch (error) {
    next(new ErrorHandler(500, "Failed to delete word"));
  }
};
