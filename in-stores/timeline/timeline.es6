import { create } from 'reactive-observables';
import { createLogger } from 'instalog';
import rpt from 'prop-types';

import getBigBangTimestamp from 'in-services/subscription/bigBangTimestamp';
import { mutateUrl, navigationParameters$ } from 'in-stores/navigation';
import { createStore, createTrackingStore } from 'in-stores/store';
import { serverTime$ } from 'in-stores/serverTime';
import { isBlank } from 'in-services/util/string';

const logger = createLogger('in-stores/timeline');

// An object of the following structure
// {
//   windowSize: <number: Number of milliseconds the window should be big>
//   to?: <number: An optional, fixed end point in time>
// }
export const timeframe$ = createTrackingStore({
  name: 'timeline/timeline',
  observable: navigationParameters$
    .map(params => {
      let to = null;
      const toQuery = params.query['timeline.to'];
      if (toQuery != null && toQuery.length > 0) {
        try {
          const parsed = parseInt(toQuery, 10);
          if (!isNaN(parsed)) {
            to = parsed;
          }
        } catch (e) {
          logger.info(`Failed to parse timeline.to part of query. Given: ${toQuery}`);
        }
      }

      let windowSize = 1000 * 60 * 10;
      const windowSizeQuery = params.query['timeline.ws'];
      if (windowSizeQuery != null && windowSizeQuery.length > 0) {
        try {
          const parsed = parseInt(windowSizeQuery, 10);
          if (!isNaN(parsed)) {
            windowSize = parsed;
          }
        } catch (e) {
          logger.info(`Failed to parse timeline.ws part of query. Given: ${windowSizeQuery}`);
        }
      }

      return { to, windowSize };
    })
    .distinct((prev, next) => prev.to !== next.to || prev.windowSize !== next.windowSize)
}).observable;
export const timeframe = timeframe$;

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
    navParams.query['timeline.to'] = encodeURIComponent(to == null ? '' : to);
    return navParams;
  });
}

export const focusedMoment$ = createTrackingStore({
  name: 'timeline/focusedMoment',
  observable: navigationParameters$
    .map(params => {
      const focusedMoment = params.query['timeline.fm'];
      if (focusedMoment == null || focusedMoment.length === 0) {
        return null;
      }

      try {
        const parsed = parseInt(focusedMoment, 10);
        if (!isNaN(parsed)) {
          return parsed;
        }
      } catch (e) {
        logger.info(`Failed to parse timeline.fm part of query. Given: ${focusedMoment}`);
      }

      return null;
    })
    .distinct()
}).observable;

let currentTimeframe;
timeframe$.subscribe(tf => currentTimeframe = tf);

let currentServertime;
serverTime$.subscribe(st => currentServertime = st);

export function setFocusedMoment(newFocusedMoment) {
  mutateUrl(navParams => {
    navParams.query['timeline.fm'] = encodeURIComponent(newFocusedMoment != null ? newFocusedMoment : '');
    if (newFocusedMoment && !currentTimeframe.to) {
      navParams.query['timeline.to'] = encodeURIComponent(
        currentTimeframe.to ? currentTimeframe.to : currentServertime
      );
    }
    navParams.query['timeline.ws'] = encodeURIComponent(currentTimeframe.windowSize);
    return navParams;
  });
}

export function lockFocusedMoment() {
  serverTime$.once(sTime => {
    mutateUrl(navParams => {
      if (isBlank(navParams.query['timeline.fm'])) {
        navParams.query['timeline.fm'] = encodeURIComponent(sTime);
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

export const timeframeShape = rpt.shape({
  windowSize: rpt.number.isRequired,
  to: rpt.number
});

export function setTimeframe(windowSize, to = null) {
  mutateUrl(navParams => {
    navParams.query['timeline.to'] = encodeURIComponent(to == null ? '' : to);
    navParams.query['timeline.ws'] = encodeURIComponent(windowSize);
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
