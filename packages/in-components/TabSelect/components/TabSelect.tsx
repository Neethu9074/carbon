/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { PropsWithChildren, useState } from 'react';

import { TabSelectContext } from 'in-components/TabSelect/context';

import locals from './TabSelect.mless';

interface TabSelectProps<VALUE_TYPE> {
  /**
   * The ID of the TabSelectPanel that should be active initially.
   */
  initialActivePanelId?: string;

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
   * @param value the value of the TabSelectItem that has been selected if value was provided
   */
  onChange?: (panelId?: string, value?: VALUE_TYPE) => void;
}

export default function TabSelect<VALUE_TYPE>({
  children,
  initialActivePanelId,
  onChange,
  menuWidth = '30%',
  panelsWidth = '70%'
}: PropsWithChildren<TabSelectProps<VALUE_TYPE>>) {
  const [activePanelId, setActivePanelId] = useState(initialActivePanelId);

  return (
    <div>
      <TabSelectContext.Provider
        value={{
          activePanelId,
          setActivePanelId: (panelId, value) => {
            onChange?.(panelId, value);
            setActivePanelId(panelId);
          }
        }}
      >
        <div
          className={locals.container}
          style={{ gridTemplateColumns: `[menu] ${menuWidth} [panels] ${panelsWidth}` }}
        >
          {children}
        </div>
      </TabSelectContext.Provider>
    </div>
  );
}
