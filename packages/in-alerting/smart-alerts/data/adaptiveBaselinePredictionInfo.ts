/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc. 2025
 */

// TODO , this will be updated from backend so we can remove this once BE type is available
export interface AdaptiveBaselinePredictionData {
  warningPredictionValue: number;
  criticalPredictionValue: number;
}

export interface AdaptiveBaselinePredictionsInfo {
  [key: string]: AdaptiveBaselinePredictionData;
}

export type AdaptiveBaselineFetchedPredictions = [number, number, number][];
