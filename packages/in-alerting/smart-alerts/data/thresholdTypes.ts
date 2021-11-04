/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import {
  AdaptiveBaselineConfig,
  HistoricBaselineConfig,
  StaticThresholdConfig,
  ThresholdConfig,
  ThresholdType
} from 'in-types';

export const STATIC_THRESHOLD: ThresholdType = 'staticThreshold';
export const HISTORIC_BASELINE: ThresholdType = 'historicBaseline';
export const ADAPTIVE_BASELINE: ThresholdType = 'adaptiveBaseline';

/* type guards */

export function isHistoricBaselineConfig(threshold: ThresholdConfig): threshold is HistoricBaselineConfig {
  return threshold.type === HISTORIC_BASELINE;
}

export function isStaticThresholdConfig(threshold: ThresholdConfig): threshold is StaticThresholdConfig {
  return threshold.type === STATIC_THRESHOLD;
}

export function isAdaptiveBaselineConfig(threshold: ThresholdConfig): threshold is AdaptiveBaselineConfig {
  return threshold.type === ADAPTIVE_BASELINE;
}
