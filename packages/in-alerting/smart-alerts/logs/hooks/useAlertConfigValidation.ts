/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { AlertingTearSheetStepConfigs } from 'in-alerting/components/AlertingFullScreenTearSheet';

export default function useAlertConfigValidation(stepConfigs: AlertingTearSheetStepConfigs[]) {
  return [
    {
      ...stepConfigs[0],
      valid: true
    },
    {
      ...stepConfigs[1],
      valid: true
    },
    {
      ...stepConfigs[2],
      valid: true
    },
    {
      ...stepConfigs[3],
      valid: true
    }
  ];
}
