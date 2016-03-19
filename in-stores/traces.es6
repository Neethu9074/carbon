import createTraceObservable from 'in-services/subscription/traces';
import {createStore} from 'in-stores/store';
import {mutateUrl, navigationParameters} from 'in-stores/navigation';

const selectedTraceIdStore = createStore({
  name: 'selectedTraceId',
  initialValue: null
});
export const selectedTraceId = selectedTraceIdStore.observable.distinct();

export function setSelectedTraceId(id) {
  if (id == null) {
    clearSelectedTraceId();
  } else {
    mutateUrl(navParams => {
      navParams.query.traceId = encodeURIComponent(id);
      return navParams;
    });
  }
}

export function clearSelectedTraceId() {
  mutateUrl(navParams => {
    delete navParams.query.traceId;
    return navParams;
  });
}

navigationParameters.subscribe(navParams => {
  const query = navParams.query;
  if ('traceId' in query) {
    const traceId = decodeURIComponent(query.traceId);
    selectedTraceIdStore.applyStateMutation(() => traceId);
  } else {
    selectedTraceIdStore.applyStateMutation(() => null);
  }
});


export function getTraces(onlyTracesFasterThan) {
  return createTraceObservable(onlyTracesFasterThan);
}
