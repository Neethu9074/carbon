/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { IS_MONITORING_HOSTS } from 'in-services/tracking/tracking';
import isMonitoring from 'in-subscription/isMonitoring';
import { createTrackingStore } from 'in-stores/store';
import { track } from 'in-services/tracking/appcues';

export const isMonitoring$ = createTrackingStore({
  name: 'isMonitoring',
  observable: isMonitoring()
}).observable.distinct();

export function init() {
  isMonitoring$.filter(Boolean).once(() => track(IS_MONITORING_HOSTS));
}
