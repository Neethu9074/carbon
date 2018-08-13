import { get } from 'lodash';

export default function memoizeOnCases(noDataMillis, liveMillis, defaultMillis) {
  return (args, lastEmittedValue) => {
    const [data] = args;

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
