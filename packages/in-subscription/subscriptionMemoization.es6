import { get } from 'lodash';

export default function memoizeOnCases(millis = {}) {
  const noDataMillis = millis.noDataMillis || 200;
  const liveMillis = millis.liveMillis || 1000 * 30;
  const defaultMillis = millis.defaultMillis || 1000 * 60 * 2;

  return ([data], lastEmittedValue) => {
    if (!lastEmittedValue || !lastEmittedValue.data) {
      return noDataMillis;
    }

    if (isLiveSubscription(data)) {
      return liveMillis;
    }

    return defaultMillis;
  };
}

function isLiveSubscription(data) {
  const timeConfig = get(data, ['filter', 'timeConfig'], get(data, ['timeConfig'], undefined));
  if (!timeConfig) {
    return false;
  }

  return timeConfig.to == null;
}
