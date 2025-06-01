export interface StartLessonRequest {
  lessonId: string;
}

export interface CompleteLessonRequest {
  lessonId: string;
}

export interface CurrentProgressResponse {
  lessonId: string;
  started: boolean;
  completed: boolean;
  updatedAt: string;
}
