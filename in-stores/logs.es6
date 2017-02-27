import getLogCountInternal from 'in-services/subscription/getLogCount';
import {luceneEscapeString} from 'in-stores/search/manipulation';
import {timeframe$} from 'in-stores/timeline';

export function getLogQueryForHost(snapshotId) {
  return `host:"${luceneEscapeString(snapshotId)}"`;
}

export function getLogCount(query) {
  return timeframe$.flatMap(timeframe => {
    return getLogCountInternal({
      maxTimestamp: timeframe.to,
      minTimestamp: timeframe.to - timeframe.windowSize,
      query
    });
  });
}
