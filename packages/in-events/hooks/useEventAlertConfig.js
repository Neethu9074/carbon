/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { getAlertConfigByIdAndTimestamp } from 'in-applications/api/applicationAlertConfig';
import useObservable from 'in-hooks/useObservable';

export default function useEventAlertConfig(event) {
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
