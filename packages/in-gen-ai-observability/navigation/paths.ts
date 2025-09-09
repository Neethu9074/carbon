/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { getRootPathPredicate } from 'in-stores/navigation/paths';

export const pageTypes = {
  llm_metrics: 'llmmetrics',
  traces: 'traces'
};
export type SelectedPageTypes = (typeof pageTypes)[keyof typeof pageTypes];
export const llmMetricsMonitoring = `/genAiObservability/${pageTypes.llm_metrics}`;
export const tracesMonitoring = `/genAiObservability/${pageTypes.traces}`;
export const datasetsPath = '/datasets/:id';
export const genAiObservability = '/genAiObservability';
export const defaultDashboard = genAiObservability;
export const isEvaluationView = getRootPathPredicate(genAiObservability);
