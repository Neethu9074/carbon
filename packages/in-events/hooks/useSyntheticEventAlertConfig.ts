/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useObservable } from '@instana/hooks';

import { getAlertConfigByIdAndTimestamp } from 'in-alerting/smart-alerts/synthetics/api/syntheticAlertConfig';
import { SyntheticAlertConfigWithMetadata, Nullish } from 'in-types';

export default function useSyntheticEventAlertConfig(event: any | Nullish): SyntheticAlertConfigWithMetadata | Nullish {
  return useObservable(
    ([event]) => {
      if (!event) {
        return;
      }
      const configId = event.getIn(['metadata', 'eventSpecificationId']);
      const configTimestamp = event.getIn(['metadata', 'alertConfigCreated']);
      return getAlertConfigByIdAndTimestamp(configId, configTimestamp);
    },
    [event]
  );
}
