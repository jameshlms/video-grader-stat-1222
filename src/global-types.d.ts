export {};

declare global {
  type GradingData = {
    count: number;
    data: Record<string, string[] | number[] | boolean[]>;
  };

  type GradingPayload = {
    csvTexts: string[];
    studentNames: string[];
    completionThreshold: number;
    forgivenessDegree: number;
  };
}
