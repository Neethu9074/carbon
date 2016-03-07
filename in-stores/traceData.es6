import Immutable from 'immutable';

import createTraceDataObservable from 'in-services/subscription/traceData';


const tempData = [];
for (let i = 0; i < 100; i++) {
  tempData[i] = { id: i, name: 'name ' + i, size: (Math.random() * 10000) | 0 };
}
export const traceData = createTraceDataObservable().startWith(Immutable.fromJS(tempData));
traceData.startWith(Immutable.fromJS(tempData));
