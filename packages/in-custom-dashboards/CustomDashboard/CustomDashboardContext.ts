/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { createContext } from 'react';

export interface CustomDashboardContextProps {
  setExportWidgetId: React.Dispatch<React.SetStateAction<string>>;
  setTooltipRef: React.Dispatch<React.SetStateAction<HTMLElement>>;
  setShouldExportWidget: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CustomDashboardContext = createContext<CustomDashboardContextProps>({
  setExportWidgetId: () => {},
  setTooltipRef: () => {},
  setShouldExportWidget: () => {}
});
