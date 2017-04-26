import { combineLatest } from 'reactive-observables';

import getLogCountInternal from 'in-services/subscription/getLogCount';
import { luceneEscapeString } from 'in-stores/search/manipulation';
import { timeframe$, focusedMoment$ } from 'in-stores/timeline';

export function getLogQueryForHost(snapshotId) {
  return `host:"${luceneEscapeString(snapshotId)}"`;
}

export function getLogCount(query) {
  return combineLatest([timeframe$, focusedMoment$]).flatMap(([_timeframe, _focusedMoment]) =>
    getLogCountInternal({
      focusedMoment: _focusedMoment,
      timeframe: _timeframe,
      query
    })
  );
}
