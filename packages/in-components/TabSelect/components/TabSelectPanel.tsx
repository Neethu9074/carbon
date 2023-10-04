/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { PropsWithChildren } from 'react';
import classNames from 'classnames';

import { PanelIdBase, useTabSelectContext } from 'in-components/TabSelect/context';

import locals from './TabSelect.mless';

export interface TabSelectPanelProps<PanelId extends PanelIdBase> {
  /**
   * Identifier by which a panel is activated or deactivated.
   */
  id: PanelId;
}

export function TabSelectPanel<PanelId extends PanelIdBase>({
  id,
  children
}: PropsWithChildren<TabSelectPanelProps<PanelId>>) {
  const { activePanelId } = useTabSelectContext<PanelId>();

  const isActive = activePanelId === id;

  return <div className={classNames(locals.panel, { [locals.panelActive]: isActive })}>{isActive && children}</div>;
}
