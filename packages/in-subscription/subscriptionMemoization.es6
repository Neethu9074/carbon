import { get } from 'lodash';

export default function memoizeOnCases({
  noDataMillis = defaultMemoizeConfig.noDataMillis,
  liveMillis = defaultMemoizeConfig.liveMillis,
  defaultMillis = defaultMemoizeConfig.defaultMillis
}) {
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

const defaultMemoizeConfig = {
  noDataMillis: 200,
  liveMillis: 1000 * 30,
  defaultMillis: 1000 * 60 * 2
};

export const defaultMemoize = memoizeOnCases(defaultMemoizeConfig);

function isLiveSubscription(data) {
  const timeConfig = get(data, ['filter', 'timeConfig'], get(data, ['timeConfig'], undefined));
  if (!timeConfig) {
    return false;
  }

  return timeConfig.to == null;
}
