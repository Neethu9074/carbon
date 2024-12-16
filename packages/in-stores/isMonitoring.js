/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import isMonitoring from 'in-subscription/isMonitoring';
import { createTrackingStore } from 'in-stores/store';

export const isMonitoring$ = createTrackingStore({
  name: 'isMonitoring',
  observable: isMonitoring()
}).observable.distinct();
