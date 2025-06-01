import { Request, Response } from "express";
import { AppDataSource } from "../config/ormconfig";
import { UserLessonProgress } from "../entities/UserLessonProgress";
import { Users } from "../entities/User";
import { Lesson } from "../entities/Lesson";
import {
  StartLessonRequest,
  CompleteLessonRequest,
  CurrentProgressResponse,
} from "../interfaces/learning/UserProgress";
import { ApiResponse } from "../interfaces/ApiResponse";

export const startLesson = async (
  req: Request<{}, {}, StartLessonRequest>,
  res: Response<ApiResponse<{ message: string }>>
) => {
  const { lessonId } = req.body;

  const users = req.user as Users;
  const userId = users.userId;

  const repo = AppDataSource.getRepository(UserLessonProgress);
  const userRepo = AppDataSource.getRepository(Users);
  const lessonRepo = AppDataSource.getRepository(Lesson);

  const user = await userRepo.findOneBy({ userId });
  const lesson = await lessonRepo.findOneBy({ id: lessonId });
  if (!user || !lesson) {
    res.status(404).json({
      success: false,
      error: { errorCode: "NOT_FOUND", message: "User or lesson not found" },
    });
  }

  let progress = null;
  if (user && lesson) {
    progress = await repo.findOne({ where: { user, lesson } });
  }
  if (!progress) {
    progress = repo.create({
      user: { userId },
      lesson: { id: lessonId },
      started: true,
    });
  } else {
    progress.started = true;
  }
  await repo.save(progress);

  res.json({ success: true, data: { message: "Lesson started" } });
};

export const completeLesson = async (
  req: Request<{}, {}, CompleteLessonRequest>,
  res: Response<ApiResponse<{ message: string }>>
) => {
  const { lessonId } = req.body;
  const users = req.user as Users;
  const userId = users.userId;

  const repo = AppDataSource.getRepository(UserLessonProgress);
  const user = await AppDataSource.getRepository(Users).findOneBy({ userId });
  const lesson = await AppDataSource.getRepository(Lesson).findOneBy({
    id: lessonId,
  });

  if (!user || !lesson) {
    res.status(404).json({
      success: false,
      error: { errorCode: "NOT_FOUND", message: "User or lesson not found" },
    });
  }

  let progress =
    user && lesson ? await repo.findOne({ where: { user, lesson } }) : null;
  if (!progress) {
    progress = repo.create({
      user: { userId },
      lesson: { id: lessonId },
      completed: true,
      started: true,
    });
  } else {
    progress.completed = true;
  }
  await repo.save(progress);

  res.json({ success: true, data: { message: "Lesson completed" } });
};

export const getCurrentProgress = async (
  req: Request,
  res: Response<ApiResponse<CurrentProgressResponse[]>>
) => {
  const users = req.user as Users;
  const userId = users.userId;

  const repo = AppDataSource.getRepository(UserLessonProgress);
  const progresses = await repo.find({
    where: { user: { userId } },
    relations: [
      "lesson",
      "lesson.step",
      "lesson.step.gate",
      "lesson.step.gate.section",
    ],
    order: { updatedAt: "DESC" },
  });
  res.json({
    success: true,
    data: progresses.map((p) => ({
      lessonId: p.lesson?.id ?? "",
      lessonTitle: p.lesson?.title ?? "",
      stepId: p.lesson?.step?.id ?? "",
      gateId: p.lesson?.step?.gate?.id ?? "",
      sectionId: p.lesson?.step?.gate?.section?.id ?? "",
      started: p.started,
      completed: p.completed,
      updatedAt: p.updatedAt.toISOString(),
    })),
  });
};
