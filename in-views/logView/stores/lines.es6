import { combineLatest } from 'reactive-observables';

import { timeframe$, from$, to$, focusedMoment$ } from 'in-stores/timeline';
import { debouncedQuery$ as query$ } from 'in-stores/search/query';
import { formatDateTime } from 'in-services/formatters/date';
import getLogs from 'in-services/subscription/getLogs';
import { emptyArray } from 'in-services/fixedObjects';
import { createStore } from 'in-stores/store';

let initPhase = false;
let enabled = false;
let subscriptions = [];
let loadSubscription;

// Timestamp bounds to use for queries. Will only be updated when the view
// becomes visible, when the timeframe changes or when the user explicitly
// hits refresh (or via auto refresh).
let maxTimestamp;
let minTimestamp;
let focusedMoment;

let query;

const linesStore = createStore({
  name: 'in-views/logView/lines',
  initialValue: emptyArray
});
export const lines$ = linesStore.observable;

const isLoadingStore = createStore({
  name: 'in-views/logView/isLoading',
  initialValue: false
});
export const isLoading$ = isLoadingStore.observable;

export function enable() {
  initPhase = true;
  subscriptions = [];

  subscriptions.push(timeframe$.subscribe(refresh));
  subscriptions.push(focusedMoment$.subscribe(refresh));
  subscriptions.push(
    query$.subscribe(_query => {
      query = _query;
      refresh();
    })
  );

  initPhase = false;
  enabled = true;
  refresh();
}

export function disable() {
  enabled = false;
  linesStore.mutateTo(emptyArray);
  subscriptions.forEach(s => s.dispose());
  disposeExistingLoad();
  subscriptions = [];
}

export function refresh() {
  if (initPhase || !enabled) {
    return;
  }

  combineLatest([focusedMoment$, to$, from$]).once(([_focusedMoment, to, from]) => {
    focusedMoment = _focusedMoment;
    maxTimestamp = to;
    minTimestamp = from;

    linesStore.mutateTo(emptyArray);
    loadMoreLines();
  });
}

export function loadMoreLines() {
  if (initPhase || !enabled) {
    return;
  }

  disposeExistingLoad();
  isLoadingStore.mutateTo(true);

  lines$.once(lines => {
    const offset = lines.length;
    const maxTimestampForQuery = lines.length > 0 ? lines[lines.length - 1].time : maxTimestamp;
    if (maxTimestampForQuery != null) {
      loadSubscription = getLogs({
        time: focusedMoment,
        maxTimestamp: maxTimestampForQuery,
        minTimestamp,
        query,
        offset
      }).once(addNewLines);
    }
  });
}

function addNewLines(newLines) {
  const transformedLines = newLines.reduce(
    (agg, line) => {
      const lines = line.message.split('\n');
      const time = line.time;
      const timeFormatted = formatDateTime(line.time);

      agg.push({
        timeFormatted,
        time,
        message: lines[0],
        hostSnapshotId: line.hostSnapshotId,
        level: line.level,
        levelColor: getLevelColor(line.level),
        logger: line.logger,
        component: line.component
      });

      for (let i = 1, len = lines.length; i < len; i++) {
        const message = lines[i];
        if (message && message.length > 0) {
          agg.push({
            message,
            continuation: true
          });
        }
      }

      return agg;
    },
    []
  );

  linesStore.applyStateMutation(existingLines => {
    return existingLines.concat(transformedLines);
  });
  isLoadingStore.mutateTo(false);
}

function disposeExistingLoad() {
  if (loadSubscription) {
    loadSubscription.dispose();
    loadSubscription = null;
  }
}

function getLevelColor(level) {
  if (!level) {
    return undefined;
  } else if (/^err(or)?$/i.test(level)) {
    return '#EB3941';
  } else if (/^warn(ing)?$/i.test(level)) {
    return '#F5BD02';
  } else if (/^info$/i.test(level)) {
    return '#2B53CD';
  }
  return undefined;
}
