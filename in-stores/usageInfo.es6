import createUsageInfoSubscription from 'in-services/subscription/usageInfo';
import {createTrackingStore, createStore} from 'in-stores/store';

export const usageInfo$ = createTrackingStore({
  name: 'in-stores/usageInfo/usageInfo',
  observable: createUsageInfoSubscription()
}).observable;


const usageInfoVisibleStore = createStore({
  name: 'in-stores/usageInfo/usageInfoVisible',
  initialValue: true
});
export const usageInfoVisible$ = usageInfoVisibleStore.observable;

export function hideUsageInfo() {
  usageInfoVisibleStore.mutateTo(false);
}
