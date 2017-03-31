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

    return compressTrace(transformTrace(selectedTrace));
  })
}).observable;
