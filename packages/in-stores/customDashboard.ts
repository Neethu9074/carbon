/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { createStore } from 'in-stores/store';

// This store is used to control the custom dashboard configuration.
// The configurations can now be accessed throughout as needed.
// One of the use cases being from the CustomDashboard as well as the AIChat
const customDashboardConfigStore = createStore({
  name: 'customDashboardConfig',
  initialValue: {
    config: false
  }
});

export const customDashboardConfig = customDashboardConfigStore.observable;
export const customDashboardConfig$ = customDashboardConfig;

export function setCustomDashboardConfig(config: any) {
  const newValue = {
    config: config
  };
  customDashboardConfigStore.mutateTo(newValue);
}
