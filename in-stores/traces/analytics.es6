import { fromJS } from 'immutable';
import { isEqual } from 'lodash';

import { maximumNumberOfTracesForAnalytics } from 'in-services/featureFlags';
import { getKeyCount, shallowCopy } from 'in-services/util/object';
import { createStore } from 'in-stores/store';

const selectedTraces = createStore({
  name: 'traces/analytics/selectedTraces',
  // trace id => immutable shallow root span
  initialValue: {
    '-3934138743993700831': fromJS({
      traceId: '-3934138743993700831',
      start: 1494739776347,
      errorCount: 1,
      error: true,
      data: {
        http: {
          method: 'GET',
          host: 'localhost:84',
          url: '/shop',
          status: '500'
        }
      },
      totalErrorCount: 0,
      name: 'spring-web',
      duration: 14,
      kind: 'entry',
      rels: {
        destinationPhysicalEndpoint: {
          pid: '5698',
          host_id: 'ae:f6:5c:ff:fe:94:ce:ee'
        },
        destinationServiceId: 'P9wdg-O_QgPAOgiqtk_ErPIUAzs'
      },
      batchSize: 0
    }),
    '-9203742528333768621': fromJS({
      traceId: '-9203742528333768621',
      start: 1494739776289,
      errorCount: 1,
      error: true,
      data: {
        http: {
          method: 'GET',
          host: 'localhost:84',
          url: '/shop',
          status: '500'
        }
      },
      totalErrorCount: 0,
      name: 'spring-web',
      duration: 32,
      kind: 'entry',
      rels: {
        destinationPhysicalEndpoint: {
          pid: '5698',
          host_id: 'ae:f6:5c:ff:fe:94:ce:ee'
        },
        destinationServiceId: 'P9wdg-O_QgPAOgiqtk_ErPIUAzs'
      },
      batchSize: 0
    }),
    '7867761613560289337': fromJS({
      traceId: '7867761613560289337',
      start: 1494739776280,
      errorCount: 1,
      error: true,
      data: {
        http: {
          method: 'GET',
          host: 'localhost:84',
          url: '/shop',
          status: '500'
        }
      },
      totalErrorCount: 0,
      name: 'spring-web',
      duration: 13,
      kind: 'entry',
      rels: {
        destinationPhysicalEndpoint: {
          pid: '5698',
          host_id: 'ae:f6:5c:ff:fe:94:ce:ee'
        },
        destinationServiceId: 'P9wdg-O_QgPAOgiqtk_ErPIUAzs'
      },
      batchSize: 0
    }),
    '2533176127275033': fromJS({
      traceId: '2533176127275033',
      start: 1494739776263,
      errorCount: 0,
      error: false,
      data: {
        http: {
          method: 'POST',
          host: 'localhost:87',
          url: '/signIn',
          status: 403
        }
      },
      totalErrorCount: 0,
      name: 'node.http.server',
      duration: 5,
      kind: 'entry',
      rels: {
        destinationPhysicalEndpoint: {
          pid: '31274',
          host_id: 'ae:f6:5c:ff:fe:94:ce:ee'
        },
        destinationServiceId: 'QiyNvOqgiOHPFsXDCspUp7_6nl4'
      },
      batchSize: 0
    }),
    '2994066428123968245': fromJS({
      traceId: '2994066428123968245',
      start: 1494739776281,
      errorCount: 0,
      error: false,
      data: {
        http: {
          method: 'POST',
          host: 'test-instana.instana.io:444',
          url: '/traces',
          status: '204'
        }
      },
      totalErrorCount: 0,
      name: 'jersey',
      duration: 4,
      kind: 'entry',
      rels: {
        destinationPhysicalEndpoint: {
          pid: '11469',
          host_id: '0a:35:2f:ff:fe:85:68:a1'
        },
        destinationServiceId: 'CA7Lh6KAo6Zqpi0Khr2m0KFZ02I'
      },
      batchSize: 0
    })
  },
  reducers: {
    toggle: toggleReducer,
    addTracesUntilMax: addTracesUntilMaxReducer,
    removeAll: removeAllReducer
  }
});
export const selectedTraces$ = selectedTraces.observable;
export const selectedTracesCount$ = selectedTraces$.map(getKeyCount);
export const selectedTraceIds$ = selectedTraces$
  .map(traces => Object.keys(traces).sort())
  .distinct((a, b) => !isEqual(a, b));

function toggleReducer(currentState, action) {
  const traceId = action.trace.get('traceId');
  const newState = shallowCopy(currentState);
  if (traceId in newState) {
    delete newState[traceId];
  } else {
    newState[traceId] = action.trace;
  }
  return newState;
}

export function toggleIncludeInAnalytics(trace) {
  selectedTraces.applyStateMutation({
    type: 'toggle',
    trace
  });
}

function addTracesUntilMaxReducer(currentState, action) {
  const newState = shallowCopy(currentState);

  for (
    let i = 0, length = action.traces.length;
    i < length && Object.keys(newState).length < maximumNumberOfTracesForAnalytics;
    i++
  ) {
    const trace = action.traces[i];
    newState[trace.get('traceId')] = trace;
  }

  return newState;
}

export function addTracesUntilMax(traces) {
  selectedTraces.applyStateMutation({
    type: 'addTracesUntilMax',
    traces
  });
}

function removeAllReducer() {
  return {};
}

export function removeAllTraces() {
  selectedTraces.applyStateMutation({
    type: 'removeAll'
  });
}
