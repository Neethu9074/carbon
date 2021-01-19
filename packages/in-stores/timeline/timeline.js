/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { getModifiedUrlStream, mutateUrl } from 'in-stores/navigation/navigation';
import { timeConfig$, urlQueryKeys } from 'in-stores/time/config';
import { createStore } from 'in-stores/store';

export { timeConfig$ } from 'in-stores/time/config';

export function setTimeframe(windowSize, to = null) {
  mutateUrl(navParams => {
    navParams.query[urlQueryKeys.to] = to;
    navParams.query[urlQueryKeys.focusedMoment] = to;
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
    moment = moment - (moment % 1000);
    return moment;
  });
}

export function clearHighlightedMoment() {
  highlightedMomentStore.applyStateMutation(() => null);
}

export function getCurrentViewWithTimelineFocusedAt(moment) {
  return timeConfig$.flatMap(({ windowSize }) => {
    return getModifiedUrlStream(params => {
      params.query[urlQueryKeys.to] = moment;
      params.query[urlQueryKeys.focusedMoment] = moment;
      params.query[urlQueryKeys.windowSize] = windowSize;
    });
  });
}

export function getFixedTimeframeUrl({ windowSize, to, clearHighlightedTimeframe = false }) {
  return getModifiedUrlStream(navParams => {
    navParams.query[urlQueryKeys.autoRefresh] = 'false';

    navParams.query[urlQueryKeys.to] = to;
    navParams.query[urlQueryKeys.focusedMoment] = to;

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

export function getTimeframeNonLiveUrl() {
  return getModifiedUrlStream(navParams => {
    delete navParams.query.fm;
    navParams.query[urlQueryKeys.autoRefresh] = 'false';
  });
}
