import { fromJS } from 'immutable';
import { isEqual } from 'lodash';

import { getKeyCount, shallowCopy } from 'in-services/util/object';
import { createStore } from 'in-stores/store';

const selectedTraces = createStore({
  name: 'traces/analytics/selectedTraces',
  // trace id => immutable shallow root span
  initialValue: {
    '3488288632090100657': fromJS({
      traceId: '3488288632090100657',
      start: 1494586672401,
      errorCount: 0,
      error: false,
      data: {
        http: {
          method: 'GET',
          host: 'localhost:84',
          url: '/shop',
          status: '200'
        }
      },
      totalErrorCount: 0,
      name: 'spring-web',
      duration: 77,
      kind: 'entry',
      rels: {
        destinationPhysicalEndpoint: {
          pid: '5698',
          host_id: 'ae:f6:5c:ff:fe:94:ce:ee'
        },
        destinationServiceId: 'MvbDbfjmTKoiwgV0x92Qyesj2xw'
      },
      batchSize: 0
    }),
    '2070952517686851': fromJS({
      traceId: '2070952517686851',
      start: 1494591139726,
      errorCount: 0,
      error: false,
      data: {
        http: {
          method: 'GET',
          host: 'localhost:86',
          url: '/ratings',
          status: 200
        }
      },
      totalErrorCount: 0,
      name: 'node.http.server',
      duration: 44,
      kind: 'entry',
      rels: {
        destinationPhysicalEndpoint: {
          pid: '7893',
          host_id: '6e:1b:52:ff:fe:7f:04:c9'
        },
        destinationServiceId: 'WL5m7IsPVeD-x4Sy0GeA_y2CC1o'
      },
      batchSize: 0
    })
  },
  reducers: {
    toggle: toggleReducer
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
