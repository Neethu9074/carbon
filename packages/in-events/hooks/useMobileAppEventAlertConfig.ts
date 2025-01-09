/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useObservable } from '@instana/hooks';

import { MobileAppSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/eum/data/eumAlertConfigTypes';
import { getAllAlertConfigs } from 'in-alerting/smart-alerts/mobileApp/api/mobileAppAlertConfig';
import { Nullish } from 'in-types';

export default function useMobileAppEventAlertConfig(
  event: any | Nullish
): MobileAppSmartAlertConfigWithMetadata | Nullish {
  return useObservable(
    ([event]) => {
      if (!event) {
        return;
      }
      const configId = event.getIn(['metadata', 'eventSpecificationId']);
      const configTimestamp = event.getIn(['metadata', 'alertConfigCreated']);
      return getAllAlertConfigs(configId, configTimestamp);
    },
    [event]
  );
}
