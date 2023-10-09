/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

export type PanelIdBase = string | undefined;

export interface TabSelectContextType<PanelId extends PanelIdBase> {
  activePanelId: PanelId;
  onChange: (_panelId: PanelId) => void;
}

const TabSelectContext = React.createContext<TabSelectContextType<PanelIdBase>>({
  activePanelId: undefined,
  onChange: _panelId => {}
});

export function useTabSelectContext<PanelId extends PanelIdBase>() {
  const context = React.useContext<TabSelectContextType<PanelId>>(
    TabSelectContext as unknown as React.Context<TabSelectContextType<PanelId>>
  );

  if (!context) {
    throw new Error('useTabSelectContext must be used under TabSelectContextProvider');
  }
  return context;
}

export default TabSelectContext;
