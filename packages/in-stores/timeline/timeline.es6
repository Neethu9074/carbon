import { create } from 'reactive-observables';

import { timeConfig$, getTimeConfig, urlQueryKeys, timeConfigShape } from 'in-stores/time/config';
import { getModifiedUrlStream, mutateUrl } from 'in-stores/navigation/navigation';
import getBigBangTimestamp from 'in-subscription/bigBangTimestamp';
import { createStore, createTrackingStore } from 'in-stores/store';
import { serverTime$ } from 'in-stores/serverTime';
import { isBlank } from 'in-services/util/string';

// An object of the following structure
// {
//   windowSize: <number: Number of milliseconds the window should be big>
//   to?: <number: An optional, fixed end point in time>
// }
// drop non timeframe properties (we don't have json ignore unknown props in old backend versions)
// TODO remove in Q3 2018
export const timeframe$ = timeConfig$.map(config => ({ to: config.to, windowSize: config.windowSize }));
export const timeframe = timeframe$;

export function getTimeframe(params) {
  const config = getTimeConfig(params);
  // drop non timeframe properties (we don't have json ignore unknown props in old backend versions)
  // TODO remove in Q3 2018
  return { to: config.to, windowSize: config.windowSize };
}

export const to$ = timeframe$
  .flatMap(_timeframe => {
    if (_timeframe.to) {
      return create().emit(_timeframe.to);
    }
    return serverTime$;
  })
  .distinct();

export function setTo(to) {
  mutateUrl(navParams => {
    navParams.query[urlQueryKeys.to] = to == null ? '' : to;
    return navParams;
  });
}

export const focusedMoment$ = timeConfig$.map(config => config.focusedMoment).distinct();

let currentTimeframe;
timeframe$.subscribe(tf => (currentTimeframe = tf));

let currentServertime;
serverTime$.subscribe(st => (currentServertime = st));

export function setFocusedMoment(newFocusedMoment) {
  mutateUrl(navParams => {
    navParams.query[urlQueryKeys.focusedMoment] = newFocusedMoment != null ? newFocusedMoment : '';
    if (newFocusedMoment && !currentTimeframe.to) {
      navParams.query[urlQueryKeys.to] = currentTimeframe.to ? currentTimeframe.to : currentServertime;
    }
    navParams.query[urlQueryKeys.windowSize] = currentTimeframe.windowSize;
    return navParams;
  });
}

export function lockFocusedMoment() {
  serverTime$.once(sTime => {
    mutateUrl(navParams => {
      if (isBlank(navParams.query[urlQueryKeys.focusedMoment])) {
        navParams.query[urlQueryKeys.focusedMoment] = sTime;
      }
      return navParams;
    });
  });
}

export const live$ = focusedMoment$.map(moment => !moment).distinct();

export const resolvedFocusedMoment$ = focusedMoment$
  .flatMap(_focusedMoment => {
    if (_focusedMoment == null) {
      return serverTime$;
    }
    return focusedMoment$;
  })
  .distinct();

export const from$ = timeframe$
  .flatMap(_timeframe => {
    return to$.map(to => to - _timeframe.windowSize);
  })
  .distinct();

export const timeframeShape = timeConfigShape;

export function setTimeframe(windowSize, to = null) {
  mutateUrl(navParams => {
    navParams.query[urlQueryKeys.to] = to == null ? '' : to;
    navParams.query[urlQueryKeys.windowSize] = windowSize;
    return navParams;
  });
}

const highlightedMomentStore = createStore({
  name: 'timeline/highlightedMoment',
  initialValue: null
});
export const highlightedMoment$ = highlightedMomentStore.observable.distinct();

export function setHighlightedMoment(t) {
  highlightedMomentStore.applyStateMutation(() => {
    // discard all decimal places
    let moment = parseInt(t, 10);
    // floor to second
    moment = moment - moment % 1000;
    return moment;
  });
}

export function clearHighlightedMoment() {
  highlightedMomentStore.applyStateMutation(() => null);
}

export const bigBangTimestamp = createTrackingStore({
  name: 'timeline/bigBangTimestamp',
  observable: getBigBangTimestamp()
}).observable;

export const bigBangTimestamp$ = bigBangTimestamp;

export function getCurrentViewWithTimelineFocusedAt(moment) {
  return timeframe$.flatMap(({ to, windowSize }) => {
    if (to) {
      to = moment + windowSize / 2;
    } else {
      to = '';
    }
    moment = moment == null ? '' : String(moment);

    return getModifiedUrlStream(params => {
      params.query[urlQueryKeys.to] = to;
      params.query[urlQueryKeys.focusedMoment] = moment;
      params.query[urlQueryKeys.windowSize] = windowSize;
    });
  });
}

export function getFixedTimeframeUrl({ windowSize, to, focusedMoment, clearHighlightedTimeframe = false }) {
  return getModifiedUrlStream(navParams => {
    if (!focusedMoment) {
      navParams.query[urlQueryKeys.focusedMoment] = '';
    } else {
      navParams.query[urlQueryKeys.focusedMoment] = focusedMoment;
    }

    navParams.query[urlQueryKeys.to] = to == null ? '' : to;

    if (windowSize) {
      navParams.query[urlQueryKeys.windowSize] = windowSize;
    }

    if (clearHighlightedTimeframe) {
      delete navParams.query['tl.tf'];
    }
  });
}

export function getTimeframeLiveUrl() {
  return getModifiedUrlStream(navParams => {
    delete navParams.query.fm;
    navParams.query[urlQueryKeys.to] = '';
    navParams.query[urlQueryKeys.focusedMoment] = '';
  });
}
