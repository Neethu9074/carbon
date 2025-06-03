/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { createContext, useContext } from 'react';

export interface CustomDashboardContextProps {
  widgets: any;
  customDashboardTitle: string;
  exportWidgetToPdf: any;
}

export const CustomDashboardContext = createContext<CustomDashboardContextProps>({
  widgets: {},
  customDashboardTitle: '',
  exportWidgetToPdf: () => {}
});

export function useCustomDashboardContext() {
  const context = useContext(CustomDashboardContext);

  if (context === undefined) {
    throw new Error('Must be used within CustomDashboardContext Provider');
  }

  return context;
}
