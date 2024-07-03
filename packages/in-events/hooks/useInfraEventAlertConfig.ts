/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { useObservable } from '@instana/hooks';

import { InfraSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
import { getInfraAlertConfigByIdAndTimestamp } from 'in-api/infraAlertConfig';
import { EventOrMap } from 'in-events/types';
import { Nullish } from 'in-types';

export default function useInfraEventAlertConfig(
  event: EventOrMap | Nullish
): InfraSmartAlertConfigWithMetadata | Nullish {
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
