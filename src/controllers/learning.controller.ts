import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../config/ormconfig";
import {
  LearningResponse,
  SectionResponse,
} from "../interfaces/learning/learning";

export const getAllLearning = async (
  req: Request,
  res: Response<LearningResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const learningData = await AppDataSource.getRepository("Section").find({
      relations: ["gates", "gates.steps", "gates.steps.lessons"],
    });
    console.log("learningData ==> ", learningData);
    const result: SectionResponse[] = learningData.map((section) => ({
      sectionId: section.id,
      name: section.name,
      gates: section.gates.map((gate: any) => ({
        gateId: gate.id,
        name: gate.name,
        steps: gate.steps.map((step: any) => ({
          stepId: step.id,
          title: step.title,
          lessons: step.lessons.map((lesson: any) => ({
            lessonId: lesson.id,
            title: lesson.title,
            content: lesson.content,
          })),
        })),
      })),
    }));
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        errorCode: "INTERNAL_SERVER_ERROR",
        message: "An error occurred while fetching learning data.",
      },
    });
  }
};
