/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { PropsWithChildren, useContext } from 'react';
import classNames from 'classnames';

import { TabSelectContext } from 'in-components/TabSelect/context';

import locals from './TabSelect.mless';

export interface TabSelectPanelProps {
  /**
   * Identifier by which a panel is activated or deactivated.
   */
  id: string;
}

export function TabSelectPanel({ id, children }: PropsWithChildren<TabSelectPanelProps>) {
  const { activePanelId } = useContext(TabSelectContext);

  const isActive = activePanelId === id;

  return <div className={classNames(locals.panel, { [locals.panelActive]: isActive })}>{isActive && children}</div>;
}
