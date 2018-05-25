import { create } from 'reactive-observables';

import { getModifiedUrlStream, mutateUrl } from 'in-stores/navigation/navigation';
import getBigBangTimestamp from 'in-subscription/bigBangTimestamp';
import { createStore, createTrackingStore } from 'in-stores/store';
import { timeConfig$, urlQueryKeys } from 'in-stores/time/config';
export { timeConfig$ } from 'in-stores/time/config';
import { serverTime$ } from 'in-stores/serverTime';
import { isBlank } from 'in-services/util/string';

export const to$ = timeConfig$
  .flatMap(_timeConfig => {
    if (_timeConfig.to) {
      return create().emit(_timeConfig.to);
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

let currentTimeframe;
timeConfig$.subscribe(tf => (currentTimeframe = tf));

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

export const live$ = timeConfig$.map(timeConfig => timeConfig.autoRefresh).distinct();

export const from$ = timeConfig$
  .flatMap(_timeConfig => {
    return to$.map(to => to - _timeConfig.windowSize);
  })
  .distinct();

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
  return timeConfig$.flatMap(({ to, windowSize }) => {
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
    navParams.query[urlQueryKeys.autoRefresh] = 'false';

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
    navParams.query[urlQueryKeys.autoRefresh] = 'true';
  });
}
