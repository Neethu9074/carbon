/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { StaticThresholdConfig } from '@instana/types';

import { defaultTimeWindow } from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/form';
import { LogSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/logs/form/logAlertConfigTypes';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';

export default function generateAlertConfig(): LogSmartAlertConfigWithMetadata {
  const threshold: StaticThresholdConfig = {
    type: STATIC_THRESHOLD,
    lastUpdated: 0,
    operator: '>='
  } as StaticThresholdConfig;

  return {
    alertChannelIds: [],
    description: '',
    groupBy: [],
    name: '',
    severity: 5,
    //@ts-expect-error type-conflict: created would be a timestamp if created on the server.
    created: undefined,
    threshold,
    timeThreshold: {
      type: 'violationsInSequence',
      timeWindow: defaultTimeWindow
    }
  };
}
