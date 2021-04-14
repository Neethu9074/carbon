/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useObservable } from '@instana/hooks';

import { getGlobalAlertConfigByIdAndTimestamp } from 'in-alerting/smart-alerts/applications/api/globalApplicationAlertConfigs';
import { getAlertConfigByIdAndTimestamp } from 'in-alerting/smart-alerts/applications/api/applicationAlertConfig';

export default function useApplicationEventAlertConfig(event) {
  return useObservable(
    ([event]) => {
      if (!event) {
        return;
      }
      const configId = event.getIn(['metadata', 'eventSpecificationId']);
      const configTimestamp = event.getIn(['metadata', 'alertConfigCreated']);
      if (event.getIn(['metadata', 'globalSmartAlert'], false)) {
        return getGlobalAlertConfigByIdAndTimestamp(configId, configTimestamp);
      }
      return getAlertConfigByIdAndTimestamp(configId, configTimestamp);
    },
    [event]
  );
}
