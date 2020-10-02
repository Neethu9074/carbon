/* eslint-disable no-console */

import { sortedUniq, isEqual } from 'lodash';

import { formatDurationAccurately } from 'in-services/formatters/date';
import { track, VIEW_CHANGE } from 'in-services/tracking/tracking';
import { emptyObject, emptyArray } from 'in-services/fixedObjects';
import { isNotBlank, isBlank } from 'in-services/util/string';
import { navigationParameters$ } from 'in-stores/navigation';
import { onLastChance } from 'in-services/util/onLastChance';
import { getTimeConfig } from 'in-stores/time/config';
import { seconds } from 'in-services/time';

let previousState = null;
let state = {
  location: null,
  pendingTransmissionHandle: null,
  titles: emptyArray,
  meta: emptyObject
};

export function init() {
  navigationParameters$.subscribe(location => {
    transmitViewChange();
    state = {
      location,
      timeConfig: getTimeConfig(location),
      titles: state.titles,
      meta: state.meta
    };
    state.pendingTransmissionHandle = setTimeout(transmitViewChange, seconds.toMillis(10));
  });

  onLastChance(transmitViewChange);
}

function transmitViewChange() {
  if (!state.location) {
    return;
  }

  if (state.pendingTransmissionHandle) {
    clearTimeout(state.pendingTransmissionHandle);
    state.pendingTransmissionHandle = null;
  }

  const pageName = sortedUniq(state.titles.map(({ title }) => title).filter(isNotBlank)).join(' > ');
  if (isBlank(pageName)) {
    return;
  }

  const aggregatedMeta = {
    pageName,
    pagePath: state.location.pathname,
    windowSize: formatDurationAccurately(state.timeConfig.windowSize),
    ...state.meta
  };

  if (!previousState || !isEqual(getStateEqualityFields(previousState), getStateEqualityFields(state))) {
    track(VIEW_CHANGE, aggregatedMeta);
  }

  previousState = state;
  previousState.location = null;
}

// Define which values should be compared in order to identify a view change.
// A deep comparison will be executed between two states to identify a state change.
function getStateEqualityFields(state) {
  return {
    meta: state.meta,
    titles: state.titles
  };
}

export function setTitles(titles) {
  state.titles = titles;
}

export function setMeta(meta) {
  state.meta = meta;
}
