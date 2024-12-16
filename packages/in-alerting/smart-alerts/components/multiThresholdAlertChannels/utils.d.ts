/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';

import { Severity } from '@instana/types/typeDefinitions';

export function updateAlertChannelSelectionOnWarningThresholdFieldChange(
  alertChannelSelection: { [P in Severity]?: string[] },
  warningThresholdValuePresent: boolean,
  criticalThresholdValuePresent: boolean,
  form: MapForm<any>,
  updateForm: (form: MapForm<any>) => void
);

export function updateAlertChannelSelectionOnCriticalThresholdFieldChange(
  alertChannelSelection: { [P in Severity]?: string[] },
  warningThresholdValuePresent: boolean,
  criticalThresholdValuePresent: boolean,
  form: MapForm<any>,
  updateForm: (form: MapForm<any>) => void
);

export function getThresholdFieldStatus(form: MapForm<any>);
