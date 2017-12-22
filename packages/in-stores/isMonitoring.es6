import createIsMonitoringObservable from 'in-subscription/isMonitoring';
import { createTrackingStore } from 'in-stores/store';

export const isMonitoring$ = createTrackingStore({
  name: 'isMonitoring',
  observable: createIsMonitoringObservable()
}).observable.distinct();
