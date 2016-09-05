import {compress as compressTrace} from 'in-components/traceView/longTraceCompressor';
import {transform as transformTrace} from 'in-components/traceView/longTraceBuilder';
import {createTrackingStore} from 'in-stores/store';
import {selectedTrace$} from 'in-stores/traces';

export const longSelectedTrace$ = createTrackingStore({
  name: 'in-components/traceView/stores/longSelectedTrace',
  observable: selectedTrace$.map(selectedTrace => {
    if (!selectedTrace) {
      return null;
    }

    return compressTrace(transformTrace(selectedTrace));
  })
}).observable;
