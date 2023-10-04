/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { PropsWithChildren } from 'react';

import TabSelectContext, { PanelIdBase, TabSelectContextType } from 'in-components/TabSelect/context';

import locals from './TabSelect.mless';

interface TabSelectProps<PanelId extends PanelIdBase> {
  /**
   * The ID of the active TabSelectPanel.
   */
  activePanelId: PanelId;

  /**
   * The width of the menu column. Default is 30%.
   */
  menuWidth?: number | string;

  /**
   * The width of the panels column. Default is 70%.
   */
  panelsWidth?: number | string;

  /**
   * Callback that will be fired when a TabSelectItem has been selected.
   * @param panelId the id of the TabSelectPanel that has been activated
   */
  onChange: (panelId: PanelId) => void;
}

export default function TabSelect<PanelId extends PanelIdBase>({
  children,
  activePanelId,
  onChange,
  menuWidth = '30%',
  panelsWidth = '70%'
}: PropsWithChildren<TabSelectProps<PanelId>>) {
  const TabSelectContextProvider = TabSelectContext.Provider as unknown as React.Provider<
    TabSelectContextType<PanelId>
  >;

  return (
    <div>
      <TabSelectContextProvider
        value={{
          activePanelId,
          onChange
        }}
      >
        <div
          className={locals.container}
          style={{ gridTemplateColumns: `[menu] ${menuWidth} [panels] ${panelsWidth}` }}
        >
          {children}
        </div>
      </TabSelectContextProvider>
    </div>
  );
}
