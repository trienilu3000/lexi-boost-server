import { ApiResponse } from "../ApiResponse";

export interface LessonResponse {
  lessonId: string;
  title: string;
  content: string;
}

export interface StepResponse {
  stepId: string;
  title: string;
  lessons: LessonResponse[];
}

export interface GateResponse {
  gateId: string;
  name: string;
  steps: StepResponse[];
}

export interface SectionResponse {
  sectionId: string;
  name: string;
  gates: GateResponse[];
}

export type LearningResponse = ApiResponse<SectionResponse[]>;
