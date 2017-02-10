import {combineLatest} from 'reactive-observables';

import {debouncedQuery$ as query$} from 'in-stores/search/query';
import {formatDateTime} from 'in-services/formatters/date';
import {timeframe$, from$, to$} from 'in-stores/timeline';
import getLogs from 'in-services/subscription/logs';
import {emptyArray} from 'in-services/fixedObjects';
import {createStore} from 'in-stores/store';

let initPhase = false;
let enabled = false;
let subscriptions = [];
let loadSubscription;

// Timestamp bounds to use for queries. Will only be updated when the view
// becomes visible, when the timeframe changes or when the user explicitly
// hits refresh (or via auto refresh).
let maxTimestamp;
let minTimestamp;

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
  subscriptions.push(query$.subscribe(_query => {
    query = _query;
    refresh();
  }));

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

  combineLatest([to$, from$])
    .once(([to, from]) => {
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
          maxTimestamp: maxTimestampForQuery,
          minTimestamp,
          query,
          offset
        })
        .once(addNewLines);
    }
  });
}


function addNewLines(newLines) {
  const transformedLines = newLines.reduce((agg, line) => {
    const lines = line.message.split('\n');
    const time = line.time;
    const timeFormatted = formatDateTime(line.time);

    agg.push({
      timeFormatted,
      time,
      message: lines[0],
      hostSnapshotId: line.hostSnapshotId
    });

    for (let i = 0, len = lines.length; i < len; i++) {
      const message = lines[i];
      if (message && message.length > 0) {
        agg.push({
          timeFormatted,
          time,
          message,
          hostSnapshotId: line.hostSnapshotId
        });
      }
    }

    return agg;
  }, []);

  transformedLines.reverse();

  linesStore.applyStateMutation(existingLines => {
    return transformedLines.concat(existingLines);
  });
  isLoadingStore.mutateTo(false);
}


function disposeExistingLoad() {
  if (loadSubscription) {
    loadSubscription.dispose();
    loadSubscription = null;
  }
}
