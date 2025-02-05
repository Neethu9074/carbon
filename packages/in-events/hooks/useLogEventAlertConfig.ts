/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useObservable } from '@instana/hooks';

import { LogSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/logs/form/logAlertConfigTypes';
import { getLogAlertConfigByIdAndTimestamp } from 'in-api/logAlertConfig';
import { EventOrMap } from 'in-events/types';
import { Nullish } from 'in-types';

export default function useLogEventAlertConfig(event: EventOrMap | Nullish): LogSmartAlertConfigWithMetadata | Nullish {
  return useObservable(
    ([event]) => {
      if (!event) {
        return;
      }
      const configId = event.getIn(['metadata', 'eventSpecificationId']);
      const configTimestamp = event.getIn(['metadata', 'alertConfigCreated']);
      return getLogAlertConfigByIdAndTimestamp(configId, configTimestamp);
    },
    [event]
  );
}
