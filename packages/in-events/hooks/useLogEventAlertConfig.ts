/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useObservable } from '@instana/hooks';

import { getLogAlertConfigByIdAndTimestamp } from 'in-api/logAlertConfig';
import { LogAlertConfigWithMetadata, Nullish } from 'in-types';
import { EventOrMap } from 'in-events/types';

export default function useLogEventAlertConfig(event: EventOrMap | Nullish): LogAlertConfigWithMetadata | Nullish {
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
