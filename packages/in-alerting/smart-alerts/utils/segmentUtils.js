/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { deepCopy } from 'in-services/util/object';

export function getTrackingAlertConfig(alertConfig, configThresholdType) {
  const alertConfigClone = deepCopy(alertConfig);
  const thresholdType = configThresholdType ? configThresholdType : alertConfig?.threshold?.type ?? STATIC_THRESHOLD;
  if (thresholdType == STATIC_THRESHOLD) {
    return alertConfig;
  } else {
    const hasRule = 'rules' in alertConfigClone;
    return {
      ...alertConfigClone,
      threshold: thresholdWithoutBaseline(alertConfigClone.threshold),
      ...(hasRule && { rules: rulesWithoutBaseline(alertConfigClone.rules) })
    };
  }
}

export function getTrackingAlertConfigFromForm(alertConfig) {
  const alertConfigClone = deepCopy(alertConfig);
  const configThresholdType = alertConfigClone?.threshold?.type ?? alertConfigClone?.threshold?.warningThreshold?.type;
  const thresholdType = configThresholdType ?? STATIC_THRESHOLD;
  if (thresholdType == STATIC_THRESHOLD) {
    return alertConfig;
  } else {
    return {
      ...alertConfigClone,
      threshold: removeBaselineEntriesFromThresholdObj(alertConfigClone.threshold)
    };
  }
}

function rulesWithoutBaseline(rules) {
  return rules.map(rule => {
    let newRule = { ...rule }; // Clone the object to avoid modifying the original
    Object.keys(newRule.thresholds).forEach(key => {
      if (newRule.thresholds[key]?.baseline) {
        delete newRule.thresholds[key].baseline; // Remove the 'baseline' key
      }
    });
    return newRule;
  });
}

function thresholdWithoutBaseline(threshold) {
  const newThreshold = { ...threshold };
  delete newThreshold.baseline;
  return newThreshold;
}

function removeBaselineEntriesFromThresholdObj(threshold) {
  const newThreshold = { ...threshold };
  delete newThreshold.warningThreshold.baseline;
  delete newThreshold.criticalThreshold.baseline;
  return newThreshold;
}
