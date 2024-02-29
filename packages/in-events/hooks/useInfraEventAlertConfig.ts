/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { useObservable } from '@instana/hooks';

import { getInfraAlertConfigByIdAndTimestamp } from 'in-api/infraAlertConfig';
import { InfraAlertConfigWithMetadata, Nullish } from 'in-types';
import { EventOrMap } from 'in-events/types';

export default function useInfraEventAlertConfig(event: EventOrMap | Nullish): InfraAlertConfigWithMetadata | Nullish {
  return useObservable(
    ([event]) => {
      if (!event) {
        return;
      }
      const configId = event.getIn(['metadata', 'eventSpecificationId']);
      const configTimestamp = event.getIn(['metadata', 'alertConfigCreated']);
      return getInfraAlertConfigByIdAndTimestamp(configId, configTimestamp);
    },
    [event]
  );
}
