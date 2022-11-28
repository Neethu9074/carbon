/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

export interface TabSelectContextType {
  activePanelId?: string;
  setActivePanelId: (_panelId?: string, _value?: any) => void;
}

export const TabSelectContext = React.createContext<TabSelectContextType>({
  activePanelId: undefined,
  setActivePanelId: (_panelId?: string, _value?: any) => {}
});
