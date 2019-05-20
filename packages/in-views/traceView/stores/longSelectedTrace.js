import { compress as compressTrace } from 'in-views/traceView/longTraceCompressor';
import { transform as transformTrace } from 'in-views/traceView/longTraceBuilder';
import { createTrackingStore } from 'in-stores/store';
import { selectedTrace$ } from 'in-stores/traces';

export const longSelectedTrace$ = createTrackingStore({
  name: 'traceView/stores/longSelectedTrace',
  observable: selectedTrace$.map(selectedTrace => {
    if (!selectedTrace) {
      return null;
    }

    const errors = selectedTrace.get('errors');
    if (errors != null && errors.size > 0) {
      return {
        errors: errors.toJS()
      };
    }

    if (selectedTrace.getIn(['progress', 'loading'])) {
      return null;
    }

    const data = selectedTrace.get('data');

    return compressTrace(transformTrace(data));
  })
}).observable;
